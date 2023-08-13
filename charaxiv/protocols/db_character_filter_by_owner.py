import typing
from uuid import UUID

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, owner_id: UUID, until_character_id: UUID, limit: int) -> typing.Sequence[types.character.CharacterSummary]:
        ...
