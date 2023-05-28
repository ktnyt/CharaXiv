from typing import Any, Optional

from pydantic import BaseModel

from lib import id_token


class Sheet(BaseModel):
    class Content(BaseModel):
        name: str
        tags: list[str]
        data: Any

    class ContentPatch(BaseModel):
        name: Optional[str]
        tags: Optional[list[str]]
        data: Optional[Any]

    id: id_token.IDToken
    owner: id_token.IDToken
    system: str
    content: Content
    images: list[str]

    def __lt__(self, other: 'Sheet') -> bool:
        return self.id < other.id


class SheetList(BaseModel):
    sheets: list[Sheet]
