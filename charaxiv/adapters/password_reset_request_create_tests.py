import secrets

import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.password_reset_request_create import Adapter


@pytest.mark.asyncio
async def test_user_password_reset_create(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    token = secrets.token_urlsafe(32)

    adapter = Adapter(session=database_session)
    await adapter(userid=user_model.id, token=token)
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.PasswordResetRequest)
        .filter(
            repositories.database.models.PasswordResetRequest.token == token,
            repositories.database.models.PasswordResetRequest.userid == user_model.id,
        )
    )).scalar_one_or_none()

    assert out is not None
    assert out.userid == user_model.id
    assert out.token == token