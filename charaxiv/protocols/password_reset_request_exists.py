import typing
from uuid import UUID


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, userid: UUID) -> bool:
        ...
