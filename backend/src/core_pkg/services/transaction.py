from contextlib import AbstractContextManager
from typing import Protocol, runtime_checkable


@runtime_checkable
class Atomic(Protocol):
    def __call__(self) -> AbstractContextManager[None]: ...
