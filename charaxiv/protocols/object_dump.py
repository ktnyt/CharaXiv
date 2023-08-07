import typing


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self, obj: typing.Any) -> bytes:
        ...
