import typing
from uuid import UUID

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, id: UUID) -> typing.Optional[types.user.User]:
        ...
