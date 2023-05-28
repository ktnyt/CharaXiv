from typing import TYPE_CHECKING

from pydantic import BaseModel

if TYPE_CHECKING:  # pragma: no cover
    EmailStr = str
else:
    from pydantic import EmailStr


class MailContent(BaseModel):
    subject: str
    message: str


class Mail(BaseModel):
    frm: EmailStr
    to: list[EmailStr]
    cc: list[EmailStr]
    bcc: list[EmailStr]
    content: MailContent
