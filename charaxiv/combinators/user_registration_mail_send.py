from dataclasses import dataclass
from urllib.parse import urlencode

from injector import inject, singleton

from charaxiv import protocols, settings, types


@singleton
@inject
@dataclass
class Combinator:
    mail_send: protocols.mail_send.Protocol

    async def __call__(self, /, *, email: str, token: str) -> None:
        await self.mail_send(mail=types.mail.Mail(
            frm=settings.CHARAXIV_NOREPLY_EMAIL,
            to=[email],
            cc=[],
            bcc=[],
            content=types.mail.MailContent(
                subject="CharaXiv - ユーザ登録URLのご案内",
                message=(
                    f"この度はCharaXivをご利用いただきありがとうございます。\n"
                    f"ユーザ登録を完了するには24時間以内に以下のURLにアクセスしてください。\n\n"
                    f"{settings.CHARAXIV_ORIGIN}/activate?{urlencode(dict(email=email, token=token))}\n"
                )
            ),
        ))
