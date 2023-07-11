import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.user_with_email_exists import Adapter


@pytest.mark.asyncio
async def test_user_with_email_exists(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    adapter = Adapter(session=database_session)
    out = await adapter(email="test@example.com")
    assert not out

    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    out = await adapter(email="test@example.com")
    assert out
