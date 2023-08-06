import secrets

import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.password_reset_request_exists import Adapter


@pytest.mark.asyncio
async def test_user_password_reset_exists(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    out = await adapter(user_id=user_model.id)
    assert not out

    password_reset_request = repositories.database.models.PasswordResetRequest(
        user_id=user_model.id,
        token=secrets.token_urlsafe(32),
    )

    database_session.add(password_reset_request)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    out = await adapter(user_id=user_model.id)
    assert out
