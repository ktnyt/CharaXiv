import typing
from uuid import UUID


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self) -> UUID:
        ...
