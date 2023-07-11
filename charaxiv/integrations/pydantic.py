import re


class PasswordValidator:
    min_length: int
    max_length: int
    lower: bool
    upper: bool
    digit: bool
    symbol: bool

    def __init__(
        self, /, *,
        min_length: int = 12,
        max_length: int = 128,
        lower: bool = True,
        upper: bool = True,
        digit: bool = True,
        symbol: bool = True,
    ):
        self.min_length = min_length
        self.max_length = max_length
        self.lower = lower
        self.upper = upper
        self.digit = digit
        self.symbol = symbol

    def __call__(self, value: str) -> str:
        assert len(value) >= self.min_length
        assert len(value) <= self.max_length
        assert not self.lower or value != value.upper()
        assert not self.upper or value != value.lower()
        assert not self.digit or re.search(r'[0-9]', value) is not None
        assert not self.symbol or re.search(r'[!"#$%&\'\(\)*+,-./:;<=>?@\[\]\\^_`{|}~]', value) is not None
        return value
