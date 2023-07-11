import typing
from datetime import datetime


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self, dt: datetime, /) -> datetime:
        ...
