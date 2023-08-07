import typing
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from charaxiv import types


class Character(BaseModel, strict=True):
    owner_id: UUID
    system: types.system.System
    name: str
    data: typing.Any
    tags: typing.List[str]
    images: typing.List[str]
    created_at: datetime
    updated_at: datetime
