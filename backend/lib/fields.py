import re
from typing import Any, Callable, Generator


class PasswordStr(str):
    min_length = 10

    @classmethod
    def __get_validators__(cls) -> Generator[Callable[[Any], Any], None, None]:
        yield cls.is_str
        yield cls.length
        yield cls.has_upper
        yield cls.has_lower
        yield cls.has_digit
        yield cls.has_other

    @classmethod
    def is_str(cls, v: Any) -> str:
        if type(v) is not str:
            raise TypeError('password must be string')
        return v

    @classmethod
    def length(cls, v: str) -> Any:
        if len(v) < cls.min_length:
            raise ValueError('insufficient password length')
        return v

    @classmethod
    def has_lower(cls, v: str) -> Any:
        if v == v.upper():
            raise ValueError('password does not contain a lowercase letter')
        return v

    @classmethod
    def has_upper(cls, v: str) -> Any:
        if v == v.lower():
            raise ValueError('password does not contain an uppercase letter')
        return v

    @classmethod
    def has_digit(cls, v: str) -> Any:
        if re.search(r'[0-9]', v) is None:
            raise ValueError('password does not contain a digit')
        return v

    @classmethod
    def has_other(cls, v: str) -> Any:
        if re.search(r'[!"#$%&\'\(\)*+,-./:;<=>?@\[\]\\^_`{|}~]', v) is None:
            raise ValueError('password does not contain a special character')
        return v
