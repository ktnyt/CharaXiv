from typing import Protocol, runtime_checkable

from lib import id_token


@runtime_checkable
class GenerateID(Protocol):
    def __call__(self) -> id_token.IDToken: ...


@runtime_checkable
class GenerateSecret(Protocol):
    def __call__(self) -> str: ...
