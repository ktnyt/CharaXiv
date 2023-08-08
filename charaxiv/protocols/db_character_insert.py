import typing
from uuid import UUID

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, owner_id: UUID, system: types.system.System, name: str, initial_data: bytes) -> UUID:
        ...
