import orjson
import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_character_insert import Adapter


@pytest.mark.asyncio
async def test_db_character_insert(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
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

    system = types.system.System.EMOKLORE
    name = "天球院 天莉里珠"
    data = orjson.dumps(dict(ruby="てんきゅういん あまりりす", secret_memo="秘匿メモ", secret_param=42))

    adapter = Adapter(session=database_session)
    character_id = await adapter(
        owner_id=user_id,
        system=system,
        name=name,
        data=data,
    )

    character_model = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Character)
        .filter(repositories.database.models.Character.id == character_id)
    )).scalar_one()

    assert character_model.owner_id == user_id
    assert character_model.system == system
    assert character_model.name == name
    assert character_model.data == data