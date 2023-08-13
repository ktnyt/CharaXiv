import typing
from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.db_character_filter_by_owner.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, owner_id: UUID, until_character_id: UUID, limit: int) -> typing.Sequence[types.character.CharacterSummary]:
        character_models = (await self.session.execute(
            sqlalchemy.select(repositories.database.models.Character)
            .where(repositories.database.models.Character.owner_id == owner_id)
            .where(repositories.database.models.Character.id < until_character_id)
            .order_by(repositories.database.models.Character.id.desc())
            .limit(limit)
        )).scalars().all()
        return [types.character.CharacterSummary(
            id=character_model.id,
            name=character_model.name,
            tags=[tag_model.value for tag_model in sorted(character_model.tags, key=lambda tag_model: tag_model.index)],
            images=[image_model.id for image_model in sorted(character_model.images, key=lambda image_model: image_model.index)]
        ) for character_model in character_models]
