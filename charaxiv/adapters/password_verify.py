from dataclasses import dataclass

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from injector import inject, singleton

from charaxiv import protocols


@singleton
@inject
@dataclass
class Adapter(protocols.password_verify.Protocol):
    hasher: PasswordHasher

    def __call__(self, /, *, hash: str, password: str) -> bool:
        try:
            return self.hasher.verify(hash, password)
        except VerifyMismatchError:
            return False
