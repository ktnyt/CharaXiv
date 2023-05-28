import logging
import os
import urllib.parse
from typing import TypeAlias

import boto3
from attr import dataclass
from injector import Binder, InstanceProvider, inject
from mypy_boto3_ses import SESClient

from src import config, mail_pkg
from src.decorators import implements

MailLogger: TypeAlias = logging.Logger


@inject
@dataclass
class SendMailMock(mail_pkg.services.SendMail):
    logger: MailLogger

    def __call__(self, mail: mail_pkg.types.Mail) -> None:
        self.logger.info(f'{mail}')


@inject
@dataclass
class SendMailSES(mail_pkg.services.SendMail):
    ses_client: SESClient
    service_config: config.Service

    def __call__(self, mail: mail_pkg.types.Mail) -> None:
        self.ses_client.send_email(
            Source=self.service_config.NOREPLY_ADDRESS,
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
        )


@implements(mail_pkg.services.SendMail)
def send_mail_not_implemented(mail: mail_pkg.types.Mail) -> None:
    raise NotImplementedError()


@implements(mail_pkg.services.RegistrationMailTemplate)
def registration_mail_template(service_fqdn: str, registrant_address: str, registration_token: str) -> mail_pkg.types.MailContent:
    return mail_pkg.types.MailContent(
        subject='CharaXiv - 新規アカウント登録',
        message=f'''CharaXivへの新規アカウント登録を受け付けました。

以下のURLにアクセスして、アカウントの登録を完了させてください。
{service_fqdn}/activate?registrant_address={urllib.parse.quote(registrant_address)}&registration_token={registration_token}'''
    )


@implements(mail_pkg.services.PasswordResetMailTemplate)
def password_reset_mail_template(service_fqdn: str, password_reset_token: str) -> mail_pkg.types.MailContent:
    return mail_pkg.types.MailContent(
        subject='CharaXiv - パスワード再設定',
        message=f'''CharaXivのパスワード再設定を受け付けました。

以下のURLにアクセスして、パスワードの再設定を完了させてください。
{service_fqdn}/reset_password?password_reset_token={password_reset_token}''',
    )


def sesclient_provider(aws_config: config.AWS) -> SESClient:
    return boto3.client(
        service_name='ses',
        aws_access_key_id=aws_config.aws_access_key_id,
        aws_secret_access_key=aws_config.aws_secret_access_key,
        region_name=aws_config.aws_ses_region_name,
        endpoint_url=aws_config.aws_ses_endpoint_url,
    )  # pragma: no cover


def configure(binder: Binder) -> None:
    django_env = os.environ['DJANGO_ENV']
    binder.bind(MailLogger, to=InstanceProvider(logging.getLogger()))
    if django_env == 'production':  # pragma: no cover
        binder.bind(SESClient, to=sesclient_provider)
        binder.bind(mail_pkg.services.SendMail, to=SendMailSES)
    elif django_env == 'development':  # pragma: no cover
        binder.bind(mail_pkg.services.SendMail, to=SendMailMock)
    else:
        binder.bind(mail_pkg.services.SendMail, to=InstanceProvider(send_mail_not_implemented))
    binder.bind(mail_pkg.services.RegistrationMailTemplate, to=InstanceProvider(registration_mail_template))
    binder.bind(mail_pkg.services.PasswordResetMailTemplate, to=InstanceProvider(password_reset_mail_template))
