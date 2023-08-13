import secrets

import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_password_reset_request_delete_by_token import Adapter


@pytest.mark.asyncio
async def test_password_reset_reqeust_delete_by_token(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
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

    db_password_reset_request_model = repositories.database.models.PasswordResetRequest(
        token=secrets.token_urlsafe(32),
        user_id=user_id,
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
