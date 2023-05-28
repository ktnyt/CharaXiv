from src.user_pkg.types import Name


def test_username_str() -> None:
    identifier = Name(key='test', tag=1)
    assert str(identifier) == 'test#0001'

    identifier2 = Name.from_str(str(identifier))
    assert identifier == identifier2
