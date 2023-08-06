import secrets

import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.password_reset_request_get_by_token import Adapter


@pytest.mark.asyncio
async def test_password_reset_request_get_by_token(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    token = secrets.token_urlsafe(32)

    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    adapter = Adapter(session=database_session, timezone_aware=lib.timezone.aware)

    out = await adapter(token=token)
    assert out is None

    password_reset_request_model = repositories.database.models.PasswordResetRequest(
        token=token,
        user_id=user_model.id,
    )

    database_session.add(password_reset_request_model)
    await database_session.flush()

    out = await adapter(token=token)
    assert out is not None
    assert out == types.password_reset.PasswordResetRequest(
        user_id=password_reset_request_model.user_id,
        created_at=lib.timezone.aware(password_reset_request_model.created_at),
    )
