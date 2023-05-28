from typing import Protocol, runtime_checkable

from django.http import HttpRequest

from src import user_pkg


@runtime_checkable
class Authenticated(Protocol):
    def __call__(self, request: HttpRequest) -> bool: ...


@runtime_checkable
class Login(Protocol):
    def __call__(self, request: HttpRequest, email: str, password: str) -> user_pkg.types.User: ...


@runtime_checkable
class Logout(Protocol):
    def __call__(self, request: HttpRequest) -> None: ...
