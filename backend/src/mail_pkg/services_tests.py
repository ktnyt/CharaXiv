from unittest import mock

from faker import Faker

from lib import secret_token
from src import config, mail_pkg


class TestSendRegistrationNotificationMail:
    def test_success(self) -> None:
        fake = Faker()
        registrant_address = fake.unique.email()
        registration_token = secret_token.generate()
        mail_content = mail_pkg.types.MailContent(
            subject=fake.unique.sentence(),
            message=fake.unique.paragraph(),
        )

        service_config = config.Service()
        send_mail = mock.Mock(spec=mail_pkg.services.SendMail)
        registration_template = mock.Mock(spec=mail_pkg.services.RegistrationMailTemplate, side_effect=[mail_content])
        send_registration_notification_mail = mail_pkg.services.SendRegistrationNotificationMail(
            service_config=service_config,
            send_mail=send_mail,
            registration_template=registration_template,
        )
        send_registration_notification_mail(registrant_address, registration_token)

        assert registration_template.mock_calls == [mock.call(service_config.FQDN, registrant_address, registration_token)]
        assert send_mail.mock_calls == [mock.call(mail_pkg.types.Mail(
            frm=service_config.NOREPLY_ADDRESS,
            to=[registrant_address],
            cc=[],
            bcc=[],
            content=mail_content,
        ))]


class TestSendPasswordResetRequestMail:
    def test_success(self) -> None:
        fake = Faker()
        requester_address = fake.unique.email()
        reset_password_token = secret_token.generate()
        mail_content = mail_pkg.types.MailContent(
            subject=fake.unique.sentence(),
            message=fake.unique.paragraph(),
        )

        service_config = config.Service()
        send_mail = mock.Mock(spec=mail_pkg.services.SendMail)
        password_reset_mail_template = mock.Mock(spec=mail_pkg.services.PasswordResetMailTemplate, side_effect=[mail_content])
        send_password_reset_request_mail = mail_pkg.services.SendPasswordResetRequestMail(
            service_config=service_config,
            send_mail=send_mail,
            password_reset_mail_template=password_reset_mail_template,
        )
        send_password_reset_request_mail(requester_address, reset_password_token)

        assert password_reset_mail_template.mock_calls == [mock.call(service_config.FQDN, reset_password_token)]
        assert send_mail.mock_calls == [mock.call(mail_pkg.types.Mail(
            frm=service_config.NOREPLY_ADDRESS,
            to=[requester_address],
            cc=[],
            bcc=[],
            content=mail_content,
        ))]
