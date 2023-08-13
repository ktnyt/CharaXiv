import typing
from uuid import UUID


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, character_id: UUID, tags: typing.List[str]) -> None:
        ...
