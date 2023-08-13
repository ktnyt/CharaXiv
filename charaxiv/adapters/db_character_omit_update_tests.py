import orjson
import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_character_omit_update import Adapter


@pytest.mark.asyncio
async def test_db_character_omit_update(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
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

    characterid = await adapters.db_character_insert.Adapter(session=database_session)(
        owner_id=user_id,
        system=system,
        name=name,
        data=data,
    )

    adapter = Adapter(session=database_session)

    await adapter(character_id=characterid, paths=["secret_memo"])
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.CharacterDataOmit)
        .where(repositories.database.models.CharacterDataOmit.character_id == characterid)
    )).scalars().all()
    assert set([omit.path for omit in out]) == set(["secret_memo"])

    await adapter(character_id=characterid, paths=["secret_param"])
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.CharacterDataOmit)
        .where(repositories.database.models.CharacterDataOmit.character_id == characterid)
    )).scalars().all()
    assert set([omit.path for omit in out]) == set(["secret_param"])

    await adapter(character_id=characterid, paths=["secret_memo", "secret_param"])
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.CharacterDataOmit)
        .where(repositories.database.models.CharacterDataOmit.character_id == characterid)
    )).scalars().all()
    assert set([omit.path for omit in out]) == set(["secret_memo", "secret_param"])
