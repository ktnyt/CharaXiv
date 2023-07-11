import typing

from pydantic import BaseModel, EmailStr


class MailContent(BaseModel, strict=True):
    subject: str
    message: str


class Mail(BaseModel, strict=True):
    frm: EmailStr
    to: typing.Sequence[EmailStr]
    cc: typing.Sequence[EmailStr]
    bcc: typing.Sequence[EmailStr]
    content: MailContent
