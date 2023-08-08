from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.character_create.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, owner_id: UUID, system: types.system.System, name: str, data: bytes) -> UUID:
        character_model = repositories.database.models.Character(
            owner_id=owner_id,
            system=system,
            name=name,
            data=data,
        )
        self.session.add(character_model)
        await self.session.flush()
        return character_model.id