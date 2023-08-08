import secrets

import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.db_password_reset_request_delete import Adapter


@pytest.mark.asyncio
async def test_user_password_reset_delete(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    db_password_reset_request_model = repositories.database.models.PasswordResetRequest(
        token=secrets.token_urlsafe(32),
        user_id=user_model.id,
    )

    database_session.add(db_password_reset_request_model)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    await adapter(token=db_password_reset_request_model.token)

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.PasswordResetRequest)
        .filter(sqlalchemy.or_(
            repositories.database.models.PasswordResetRequest.token == db_password_reset_request_model.token,
            repositories.database.models.PasswordResetRequest.user_id == db_password_reset_request_model.user_id,
        ))
    )).scalars().all()
    assert len(out) == 0