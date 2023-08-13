import typing
from datetime import datetime, timedelta


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self, t1: datetime, t2: datetime, dt: timedelta) -> bool:
        ...
