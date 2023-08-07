import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories
from charaxiv.adapters.db_user_create import Adapter


@pytest.mark.asyncio
async def test_db_user_create(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)

    adapter = Adapter(session=database_session)
    await adapter(
        email=email,
        username=username,
        password=hashedpw,
    )

    user_model = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.User)
        .filter(repositories.database.models.User.email == email)
    )).scalar_one()

    assert password_hasher.verify(user_model.password, password)
    assert user_model.username == username
