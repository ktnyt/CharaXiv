from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import BaseModel

if TYPE_CHECKING:  # pragma: no cover
    EmailStr = str
else:
    from pydantic import EmailStr

from lib import id_token


class Name(BaseModel):
    key: str
    tag: int

    @classmethod
    def from_str(cls, s: str) -> Name:
        key, tag = s.split('#')
        return cls(key=key, tag=int(tag))

    def __str__(self) -> str:
        return f'{self.key}#{self.tag:04}'


class User(BaseModel):
    id: id_token.IDToken
    email: EmailStr
    name: Name


class Registration(BaseModel):
    email: EmailStr
    registered_at: datetime


class PasswordReset(BaseModel):
    user_id: id_token.IDToken
    requested_at: datetime
