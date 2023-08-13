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
class Adapter(protocols.db_character_omit_update.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, character_id: UUID, paths: typing.List[str]) -> None:
        await self.session.execute(
            sqlalchemy.delete(repositories.database.models.CharacterDataOmit)
            .where(repositories.database.models.CharacterDataOmit.character_id == character_id)
        )
        await self.session.execute(
            sqlalchemy.insert(repositories.database.models.CharacterDataOmit),
            [dict(character_id=character_id, path=path) for path in paths]
        )
