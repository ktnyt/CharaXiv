import secrets

import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_password_reset_request_exists import Adapter


@pytest.mark.asyncio
async def test_user_password_reset_exists(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
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

    adapter = Adapter(session=database_session)
    out = await adapter(user_id=user_id)
    assert not out

    password_reset_request = repositories.database.models.PasswordResetRequest(
        user_id=user_id,
        token=secrets.token_urlsafe(32),
    )

    database_session.add(password_reset_request)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    out = await adapter(user_id=user_id)
    assert out
