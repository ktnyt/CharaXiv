import orjson
import pytest
import sqlalchemy
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, lib, repositories, types
from charaxiv.adapters.db_character_image_insert import Adapter


@pytest.mark.asyncio
async def test_db_character_image_insert(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    for i in range(10):
        email = f"test{i}@example.com"
        username = f"user{i}"
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

        imageids = [await adapter(character_id=characterid) for _ in range(5)]
        image_models = (await database_session.execute(
            sqlalchemy.select(repositories.database.models.CharacterImage)
            .where(repositories.database.models.CharacterImage.character_id == characterid)
            .order_by(repositories.database.models.CharacterImage.index)
        )).scalars().all()
        assert [image_model.id for image_model in image_models] == imageids
