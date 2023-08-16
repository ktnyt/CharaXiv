import secrets

import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_password_reset_request_insert import Adapter


@pytest.mark.asyncio
async def test_password_reset_process_create(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
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

    token = secrets.token_urlsafe(32)

    adapter = Adapter(session=database_session)
    await adapter(user_id=user_id, token=token)
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.PasswordResetRequest)
        .filter(
            repositories.database.models.PasswordResetRequest.token == token,
            repositories.database.models.PasswordResetRequest.user_id == user_id,
        )
    )).scalar_one()

    assert out.user_id == user_id
    assert out.token == token
