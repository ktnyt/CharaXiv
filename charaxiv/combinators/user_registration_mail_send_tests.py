import secrets
from unittest import mock
from urllib.parse import urlencode

import pytest

from charaxiv import protocols, settings, types
from charaxiv.combinators.user_registration_mail_send import Combinator


@pytest.mark.asyncio
async def test_user_db_registration_mail_send() -> None:
    # Setup data
    email = "test@example.com"
    token = secrets.token_urlsafe(32)

    # Setup mocks
    manager = mock.Mock()
    manager.mail_send = mock.AsyncMock(spec=protocols)

    # Instantiate combinator
    combinator = Combinator(mail_send=manager.mail_send)

    # Execute combinator
    await combinator(email=email, token=token)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.mail_send(mail=types.mail.Mail(
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
    ]
