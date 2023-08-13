import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession
from uuid6 import uuid7

from charaxiv import adapters, lib, types
from charaxiv.adapters.db_user_password_update_by_id import Adapter


@pytest.mark.asyncio
async def test_db_user_password_update_by_id(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)

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

    out = await adapter(user_id=user_id, password=hashedpw)
    assert out is True

    updated_user = await adapters.db_user_select_by_id.Adapter(session=database_session)(id=user_id)
    assert updated_user == types.user.User(
        id=user_id,
        email=email,
        username=username,
        password=hashedpw,
        group=group,
    )

    out = await adapter(user_id=uuid7(), password=hashedpw)
    assert out is False
