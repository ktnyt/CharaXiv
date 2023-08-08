import typing

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, email: str) -> typing.Optional[types.user.User]:
        ...
