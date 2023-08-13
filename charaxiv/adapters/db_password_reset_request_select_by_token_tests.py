import secrets

import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_password_reset_request_select_by_token import Adapter


@pytest.mark.asyncio
async def test_db_password_reset_request_select_by_token(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    token = secrets.token_urlsafe(32)

    email = "test@example.com"
    username = "username"
    password = password_hasher.hash(lib.password.generate())
    group = types.user.Group.ADMIN

    user_id = await adapters.db_user_insert.Adapter(session=database_session)(
        email=email,
        username=username,
        password=password,
        group=group,
    )

    adapter = Adapter(session=database_session, timezone_aware=lib.timezone.aware)

    out = await adapter(token=token)
    assert out is None

    db_password_reset_request_model = repositories.database.models.PasswordResetRequest(
        token=token,
        user_id=user_id,
    )

    database_session.add(db_password_reset_request_model)
    await database_session.flush()

    out = await adapter(token=token)
    assert out is not None
    assert out == types.password_reset.PasswordResetRequest(
        user_id=db_password_reset_request_model.user_id,
        created_at=lib.timezone.aware(db_password_reset_request_model.created_at),
    )
