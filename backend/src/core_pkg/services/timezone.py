from datetime import datetime
from typing import Protocol, runtime_checkable


@runtime_checkable
class Now(Protocol):
    def __call__(self) -> datetime: ...
