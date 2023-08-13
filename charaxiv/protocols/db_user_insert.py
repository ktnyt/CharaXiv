import typing
from uuid import UUID

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, email: str, username: str, password: str, group: types.user.Group) -> UUID:
        ...
