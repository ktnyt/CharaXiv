import typing
from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_character_tags_update.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, character_id: UUID, tags: typing.List[str]) -> None:
        await self.session.execute(
            sqlalchemy.delete(repositories.database.models.CharacterTag)
            .where(repositories.database.models.CharacterTag.character_id == character_id)
        )
        await self.session.execute(
            sqlalchemy.insert(repositories.database.models.CharacterTag),
            [dict(character_id=character_id, value=value, index=index) for index, value in enumerate(tags)]
        )
        await self.session.flush()
