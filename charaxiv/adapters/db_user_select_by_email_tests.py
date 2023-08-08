import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.db_user_select_by_email import Adapter


@pytest.mark.asyncio
async def test_db_user_select_by_email(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    email = "test@example.com"

    adapter = Adapter(session=database_session)

    out = await adapter(email=email)
    assert out is None

    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    out = await adapter(email=email)
    assert out == types.user.User(
        id=user_model.id,
        email=user_model.email,
        username=user_model.username,
        password=user_model.password,
        group=user_model.group,
    )
