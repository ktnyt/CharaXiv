from enum import Enum, StrEnum
from uuid import UUID

from pydantic import BaseModel, EmailStr


class Scope(StrEnum):
    ADMIN = "admin"
    PLUS = "plus"
    BASE = "base"


class Group(Enum):
    ADMIN = [Scope.BASE, Scope.PLUS, Scope.ADMIN]
    PLUS = [Scope.BASE, Scope.PLUS]
    BASE = [Scope.BASE]


class User(BaseModel, strict=True):
    id: UUID
    email: EmailStr
    username: str
    password: str
    group: Group
