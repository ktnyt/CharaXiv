import typing

from charaxiv import types


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, token: str) -> typing.Optional[types.password_reset.PasswordResetRequest]:
        ...
