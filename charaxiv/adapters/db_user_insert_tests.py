import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, types
from charaxiv.adapters.db_user_insert import Adapter


@pytest.mark.asyncio
async def test_db_user_insert(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    group = types.user.Group.ADMIN

    adapter = Adapter(session=database_session)
    user_id = await adapter(
        email=email,
        username=username,
        password=hashedpw,
        group=group,
    )

    user = await adapters.db_user_select_by_id.Adapter(session=database_session)(id=user_id)
    assert user == types.user.User(
        id=user_id,
        email=email,
        username=username,
        password=hashedpw,
        group=group,
    )
