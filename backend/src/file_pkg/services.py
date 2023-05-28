from typing import Protocol, runtime_checkable


@runtime_checkable
class FileSave(Protocol):
    def __call__(self, path: str, content: bytes) -> None: ...


@runtime_checkable
class FileDelete(Protocol):
    def __call__(self, path: str) -> None: ...
