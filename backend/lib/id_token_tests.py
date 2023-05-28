import pytest
from uuid6 import uuid7

from lib import id_token


def test_id_token() -> None:
    uuid = uuid7()
    token = id_token.IDToken.from_uuid(uuid)
    assert token.to_uuid() == uuid

    with pytest.raises(ValueError):
        id_token.IDToken('invalid')
