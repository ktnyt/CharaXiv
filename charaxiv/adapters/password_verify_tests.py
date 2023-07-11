from argon2 import PasswordHasher

from charaxiv import lib
from charaxiv.adapters.password_verify import Adapter


def test_password_verify(password_hasher: PasswordHasher) -> None:
    password = lib.password.generate()
    hash = password_hasher.hash(password)

    adapter = Adapter(password_hasher)
    out = adapter(hash=hash, password=password)
    assert out

    out = adapter(hash=hash, password=password.upper())
    assert not out
