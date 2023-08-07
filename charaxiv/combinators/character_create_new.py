import typing
from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton

from charaxiv import protocols, types
from charaxiv.lib.id_token import IDToken


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    object_dump: protocols.object_dump.Protocol
    character_create: protocols.character_create.Protocol

    async def __call__(self, /, *, owner_id: UUID, system: types.system.System, data: typing.Any) -> IDToken:
        async with self.transaction_atomic():
            character_id = await self.character_create(
                owner_id=owner_id,
                system=system,
                name="",
                data=self.object_dump(data),
            )
            return IDToken.from_uuid(character_id)
