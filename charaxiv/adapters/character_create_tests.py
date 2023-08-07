import orjson
import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.character_create import Adapter


@pytest.mark.asyncio
async def test_character_create(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    user_model = repositories.database.models.User(
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    database_session.add(user_model)
    await database_session.flush()

    system = types.system.System.EMOKLORE
    name = "天球院 天莉里珠"
    data = orjson.dumps(dict(ruby="てんきゅういん あまりりす"))

    adapter = Adapter(session=database_session)
    character_id = await adapter(
        owner_id=user_model.id,
        system=system,
        name=name,
        data=data,
    )

    character_model = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Character)
        .filter(repositories.database.models.Character.id == character_id)
    )).scalar_one()

    assert character_model.owner_id == user_model.id
    assert character_model.system == system
    assert character_model.name == name
    assert character_model.data == data
