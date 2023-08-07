from argon2 import PasswordHasher

from charaxiv import lib
from charaxiv.adapters.password_hash import Adapter


def test_password_hash(password_hasher: PasswordHasher) -> None:
    password = lib.password.generate()

    adapter = Adapter(password_hasher)
    fst = adapter(password=password)
    snd = adapter(password=password)
    assert fst != snd  # salts do not match
    assert len(fst) == 97
    assert len(snd) == 97
    assert password_hasher.verify(fst, password)
    assert password_hasher.verify(snd, password)
