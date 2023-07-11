import typing


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self, /, *, token: str) -> None:
        ...
