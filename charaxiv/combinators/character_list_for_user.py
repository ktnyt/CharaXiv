import typing
from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton

from charaxiv import constants, protocols, types


@singleton
@inject
@dataclass
class Combinator:
    db_character_filter_by_owner: protocols.db_character_filter_by_owner.Protocol

    async def __call__(self, /, *, user_id: UUID, until_character_id: typing.Optional[UUID], limit: int) -> typing.Sequence[types.character.CharacterSummary]:
        return await self.db_character_filter_by_owner(
            owner_id=user_id,
            until_character_id=until_character_id or constants.UUID7_MAX,
            limit=limit,
        )
