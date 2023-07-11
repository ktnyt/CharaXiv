from dataclasses import dataclass

from argon2 import PasswordHasher
from injector import inject, singleton

from charaxiv import protocols


@singleton
@inject
@dataclass
class Adapter(protocols.password_hash.Protocol):
    hasher: PasswordHasher

    def __call__(self, /, *, password: str) -> str:
        return self.hasher.hash(password)
