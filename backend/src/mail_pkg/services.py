from dataclasses import dataclass
from typing import Protocol, runtime_checkable

from injector import inject

from src import config

from .types import Mail, MailContent


@runtime_checkable
class SendMail(Protocol):
    def __call__(self, mail: Mail) -> None: ...


@runtime_checkable
class RegistrationMailTemplate(Protocol):
    def __call__(self, service_fqdn: str, registrant_address: str, registration_token: str) -> MailContent: ...


@runtime_checkable
class PasswordResetMailTemplate(Protocol):
    def __call__(self, service_fqdn: str, password_reset_token: str) -> MailContent: ...


@inject
@dataclass
class SendRegistrationNotificationMail:
    service_config: config.Service
    send_mail: SendMail
    registration_template: RegistrationMailTemplate

    def __call__(self, registrant_address: str, registration_token: str) -> None:
        self.send_mail(Mail(
            frm=self.service_config.NOREPLY_ADDRESS,
            to=[registrant_address],
            cc=[],
            bcc=[],
            content=self.registration_template(self.service_config.FQDN, registrant_address, registration_token),
        ))


@inject
@dataclass
class SendPasswordResetRequestMail:
    service_config: config.Service
    send_mail: SendMail
    password_reset_mail_template: PasswordResetMailTemplate

    def __call__(self, requester_address: str, reset_password_token: str) -> None:
        self.send_mail(Mail(
            frm=self.service_config.NOREPLY_ADDRESS,
            to=[requester_address],
            cc=[],
            bcc=[],
            content=self.password_reset_mail_template(self.service_config.FQDN, reset_password_token),
        ))
