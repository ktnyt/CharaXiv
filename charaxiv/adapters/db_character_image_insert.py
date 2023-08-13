from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_character_image_insert.Protocol):
    session: AsyncSession

    async def __call__(self, character_id: UUID) -> UUID:
        count = (await self.session.execute(
            sqlalchemy.select(sqlalchemy.func.count())
            .select_from(repositories.database.models.CharacterImage)
            .where(repositories.database.models.CharacterImage.character_id == character_id)
        )).scalar_one()
        character_image_model = repositories.database.models.CharacterImage(
            character_id=character_id,
            index=count,
        )
        self.session.add(character_image_model)
        await self.session.flush()
        return character_image_model.id
