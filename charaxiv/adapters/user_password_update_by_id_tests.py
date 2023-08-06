import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession
from uuid6 import uuid7

from charaxiv import lib, repositories, types
from charaxiv.adapters.user_password_update_by_id import Adapter


@pytest.mark.asyncio
async def test_user_password_update_by_id(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)

    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    adapter = Adapter(session=database_session)

    out = await adapter(user_id=user_model.id, password=hashedpw)
    assert out is True

    updated_user = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.User)
        .where(repositories.database.models.User.id == user_model.id)
    )).scalar_one()
    assert updated_user.password == hashedpw

    out = await adapter(user_id=uuid7(), password=hashedpw)
    assert out is False
