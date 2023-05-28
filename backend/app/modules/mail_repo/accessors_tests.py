import urllib.parse
from logging import Logger
from unittest import mock

import pytest
from faker import Faker
from mypy_boto3_ses import SESClient

from app.modules import mail_repo
from lib import secret_token
from src import mail_pkg


def test_send_mail_mock() -> None:
    fake = Faker()
    mail = mail_pkg.types.Mail(
        frm=fake.unique.email(),
        to=[fake.unique.email()],
        cc=[fake.unique.email()],
        bcc=[fake.unique.email()],
        content=mail_pkg.types.MailContent(
            subject=fake.unique.sentence(),
            message=fake.unique.paragraph(),
        ),
    )

    manager = mock.Mock()
    manager.logger = mock.Mock(spec=Logger)

    send_mail_mock = mail_repo.accessors.SendMailMock(logger=manager.logger)
    send_mail_mock(mail=mail)

    assert manager.mock_calls == [
        mock.call.logger.info(f'{mail}'),
    ]


def test_send_mail_ses() -> None:
    fake = Faker()
    mail = mail_pkg.types.Mail(
        frm=fake.unique.email(),
        to=[fake.unique.email()],
        cc=[fake.unique.email()],
        bcc=[fake.unique.email()],
        content=mail_pkg.types.MailContent(
            subject=fake.unique.sentence(),
            message=fake.unique.paragraph(),
        ),
    )

    manager = mock.Mock()
    manager.ses_client = mock.Mock(spec=SESClient)
    manager.service_config = mock.Mock()
    manager.service_config.NOREPLY_ADDRESS = fake.unique.email()

    send_mail_ses = mail_repo.accessors.SendMailSES(
        ses_client=manager.ses_client,
        service_config=manager.service_config,
    )
    send_mail_ses(mail=mail)

    assert manager.mock_calls == [
        mock.call.ses_client.send_email(
            Source=manager.service_config.NOREPLY_ADDRESS,
            Destination={
                'ToAddresses': mail.to,
                'CcAddresses': mail.cc,
                'BccAddresses': mail.bcc,
            },
            Message={
                'Subject': {
                    'Data': mail.content.subject,
                },
                'Body': {
                    'Text': {
                        'Data': mail.content.message,
                    },
                },
            },
        ),
    ]


def test_send_mail_not_implemented() -> None:
    with pytest.raises(NotImplementedError):
        mail_repo.accessors.send_mail_not_implemented(mail=mock.Mock())


def test_registration_mail_template() -> None:
    fake = Faker()
    service_fqdn = fake.unique.domain_name()
    registrant_address = fake.unique.email()
    registration_token = secret_token.generate()

    mail_content = mail_repo.accessors.registration_mail_template(
        service_fqdn,
        registrant_address,
        registration_token,
    )

    assert mail_content == mail_pkg.types.MailContent(
        subject='CharaXiv - 新規アカウント登録',
        message=f'''CharaXivへの新規アカウント登録を受け付けました。

以下のURLにアクセスして、アカウントの登録を完了させてください。
{service_fqdn}/activate?registrant_address={urllib.parse.quote(registrant_address)}&registration_token={registration_token}'''
    )


def test_password_reset_mail_template() -> None:
    fake = Faker()
    service_fqdn = fake.unique.domain_name()
    password_reset_token = secret_token.generate()

    mail_content = mail_repo.accessors.password_reset_mail_template(
        service_fqdn,
        password_reset_token,
    )

    assert mail_content == mail_pkg.types.MailContent(
        subject='CharaXiv - パスワード再設定',
        message=f'''CharaXivのパスワード再設定を受け付けました。

以下のURLにアクセスして、パスワードの再設定を完了させてください。
{service_fqdn}/reset_password?password_reset_token={password_reset_token}'''
    )
