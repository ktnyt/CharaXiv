import typing

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, mail: types.mail.Mail) -> None:
        ...
