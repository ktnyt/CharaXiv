from datetime import datetime, timedelta
from unittest import mock

import pytest
from faker import Faker

from lib import id_token, secret_token
from lib.mockutils import ContextManagerMock
from src import core_pkg, factories, mail_pkg, user_pkg


class TestRegister:
    def test_success(self) -> None:
        fake = Faker()
        registrant_email = fake.unique.ascii_safe_email()

        registration_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.user_exists = mock.Mock(spec=user_pkg.services.EmailExists, side_effect=[False])
        manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret, side_effect=[registration_token])
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.upsert_registration = mock.Mock(spec=user_pkg.services.RegistrationUpsert)
        manager.send_registration_notification_mail = mock.Mock(spec=mail_pkg.services.SendRegistrationNotificationMail)

        register = user_pkg.services.Register(
            user_exists=manager.user_exists,
            generate_secret=manager.generate_secret,
            timezone_now=manager.timezone_now,
            atomic_transaction=manager.atomic_transaction,
            upsert_registration=manager.upsert_registration,
            send_registration_notification_mail=manager.send_registration_notification_mail,
        )
        register(registrant_email)

        assert manager.mock_calls == [
            mock.call.user_exists(registrant_email),
            mock.call.generate_secret(),
            mock.call.timezone_now(),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.upsert_registration(registrant_email, registration_token, timestamp),
            mock.call.send_registration_notification_mail(registrant_email, registration_token),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__user_exists(self) -> None:
        fake = Faker()
        registrant_email = fake.unique.ascii_safe_email()

        manager = mock.Mock()
        manager.user_exists = mock.Mock(spec=user_pkg.services.EmailExists, side_effect=[True])
        manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret)
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now)
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.upsert_registration = mock.Mock(spec=user_pkg.services.RegistrationUpsert)
        manager.send_registration_notification_mail = mock.Mock(spec=mail_pkg.services.SendRegistrationNotificationMail)

        with pytest.raises(user_pkg.exceptions.UserWithEmailAlreadyExists):
            register = user_pkg.services.Register(
                user_exists=manager.user_exists,
                generate_secret=manager.generate_secret,
                timezone_now=manager.timezone_now,
                atomic_transaction=manager.atomic_transaction,
                upsert_registration=manager.upsert_registration,
                send_registration_notification_mail=manager.send_registration_notification_mail,
            )
            register(registrant_email)

        assert manager.mock_calls == [
            mock.call.user_exists(registrant_email),
        ]


class TestActivate:
    def test_success(self) -> None:
        fake = Faker()
        registrant = factories.fake_user(fake)
        password = fake.unique.password()

        registration_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_registration = mock.Mock(
            spec=user_pkg.services.RegistrationGet,
            side_effect=[user_pkg.types.Registration(
                email=registrant.email,
                registered_at=timestamp
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp])
        manager.email_exists = mock.Mock(spec=user_pkg.services.EmailExists, side_effect=[False])
        manager.username_exists = mock.Mock(spec=user_pkg.services.UsernameExists, side_effect=[False])
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID, side_effect=[registrant.id])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.create_user = mock.Mock(spec=user_pkg.services.UserCreate)
        manager.delete_registration = mock.Mock(spec=user_pkg.services.RegistrationDelete)

        activate = user_pkg.services.Activate(
            get_registration=manager.get_registration,
            timezone_now=manager.timezone_now,
            email_exists=manager.email_exists,
            username_exists=manager.username_exists,
            generate_id=manager.generate_id,
            atomic_transaction=manager.atomic_transaction,
            create_user=manager.create_user,
            delete_registration=manager.delete_registration,
        )
        activate(registration_token, registrant.name, password)

        assert manager.mock_calls == [
            mock.call.get_registration(registration_token),
            mock.call.timezone_now(),
            mock.call.email_exists(registrant.email),
            mock.call.username_exists(registrant.name),
            mock.call.generate_id(),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.create_user(registrant, password),
            mock.call.delete_registration(registration_token),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__registration_does_not_exist(self) -> None:
        fake = Faker()
        registrant = factories.fake_user(fake)
        password = fake.unique.password()

        registration_token = secret_token.generate()

        manager = mock.Mock()
        manager.get_registration = mock.Mock(spec=user_pkg.services.RegistrationGet, side_effect=[None])
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now)
        manager.email_exists = mock.Mock(spec=user_pkg.services.EmailExists)
        manager.username_exists = mock.Mock(spec=user_pkg.services.UsernameExists)
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID)
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.create_user = mock.Mock(spec=user_pkg.services.UserCreate)
        manager.delete_registration = mock.Mock(spec=user_pkg.services.RegistrationDelete)

        with pytest.raises(user_pkg.exceptions.RegistrationDoesNotExist):
            activate = user_pkg.services.Activate(
                get_registration=manager.get_registration,
                timezone_now=manager.timezone_now,
                email_exists=manager.email_exists,
                username_exists=manager.username_exists,
                generate_id=manager.generate_id,
                atomic_transaction=manager.atomic_transaction,
                create_user=manager.create_user,
                delete_registration=manager.delete_registration,
            )
            activate(registration_token, registrant.name, password)

        assert manager.mock_calls == [
            mock.call.get_registration(registration_token),
        ]

    def test_failure__registration_expired(self) -> None:
        fake = Faker()
        registrant = factories.fake_user(fake)
        password = fake.unique.password()

        registration_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_registration = mock.Mock(
            spec=user_pkg.services.RegistrationGet,
            side_effect=[user_pkg.types.Registration(
                email=registrant.email,
                registered_at=timestamp,
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp + timedelta(days=2, microseconds=1)])
        manager.email_exists = mock.Mock(spec=user_pkg.services.EmailExists)
        manager.username_exists = mock.Mock(spec=user_pkg.services.UsernameExists)
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID)
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.create_user = mock.Mock(spec=user_pkg.services.UserCreate)
        manager.delete_registration = mock.Mock(spec=user_pkg.services.RegistrationDelete)

        with pytest.raises(user_pkg.exceptions.RegistrationExpired):
            activate = user_pkg.services.Activate(
                get_registration=manager.get_registration,
                timezone_now=manager.timezone_now,
                email_exists=manager.email_exists,
                username_exists=manager.username_exists,
                generate_id=manager.generate_id,
                atomic_transaction=manager.atomic_transaction,
                create_user=manager.create_user,
                delete_registration=manager.delete_registration,
            )
            activate(registration_token, registrant.name, password)

        assert manager.mock_calls == [
            mock.call.get_registration(registration_token),
            mock.call.timezone_now(),
        ]

    def test_failure__email_exists(self) -> None:
        fake = Faker()
        registrant = factories.fake_user(fake)
        password = fake.unique.password()

        registration_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_registration = mock.Mock(
            spec=user_pkg.services.RegistrationGet,
            side_effect=[user_pkg.types.Registration(
                email=registrant.email,
                registered_at=timestamp,
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp + timedelta(days=2)])
        manager.email_exists = mock.Mock(spec=user_pkg.services.EmailExists, side_effect=[True])
        manager.username_exists = mock.Mock(spec=user_pkg.services.UsernameExists)
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID)
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.create_user = mock.Mock(spec=user_pkg.services.UserCreate)
        manager.delete_registration = mock.Mock(spec=user_pkg.services.RegistrationDelete)

        with pytest.raises(user_pkg.exceptions.UserWithEmailAlreadyExists):
            activate = user_pkg.services.Activate(
                get_registration=manager.get_registration,
                timezone_now=manager.timezone_now,
                email_exists=manager.email_exists,
                username_exists=manager.username_exists,
                generate_id=manager.generate_id,
                atomic_transaction=manager.atomic_transaction,
                create_user=manager.create_user,
                delete_registration=manager.delete_registration,
            )
            activate(registration_token, registrant.name, password)

        assert manager.mock_calls == [
            mock.call.get_registration(registration_token),
            mock.call.timezone_now(),
            mock.call.email_exists(registrant.email),
        ]

    def test_failure__username_exists(self) -> None:
        fake = Faker()
        registrant = factories.fake_user(fake)
        password = fake.unique.password()

        registration_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_registration = mock.Mock(
            spec=user_pkg.services.RegistrationGet,
            side_effect=[user_pkg.types.Registration(
                email=registrant.email,
                registered_at=timestamp,
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp + timedelta(days=2)])
        manager.email_exists = mock.Mock(spec=user_pkg.services.EmailExists, side_effect=[False])
        manager.username_exists = mock.Mock(spec=user_pkg.services.UsernameExists, side_effect=[True])
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID)
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.create_user = mock.Mock(spec=user_pkg.services.UserCreate)
        manager.delete_registration = mock.Mock(spec=user_pkg.services.RegistrationDelete)

        with pytest.raises(user_pkg.exceptions.UserWithNameAlreadyExists):
            activate = user_pkg.services.Activate(
                get_registration=manager.get_registration,
                timezone_now=manager.timezone_now,
                email_exists=manager.email_exists,
                username_exists=manager.username_exists,
                generate_id=manager.generate_id,
                atomic_transaction=manager.atomic_transaction,
                create_user=manager.create_user,
                delete_registration=manager.delete_registration,
            )
            activate(registration_token, registrant.name, password)

        assert manager.mock_calls == [
            mock.call.get_registration(registration_token),
            mock.call.timezone_now(),
            mock.call.email_exists(registrant.email),
            mock.call.username_exists(registrant.name),
        ]


class TestRequestPasswordReset:
    def test_success(self) -> None:
        fake = Faker()
        user_id = id_token.generate()
        requester_email = fake.unique.ascii_safe_email()

        password_reset_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.email_to_id = mock.Mock(spec=user_pkg.services.EmailToID, side_effect=[user_id])
        manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret, side_effect=[password_reset_token])
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.upsert_password_reset = mock.Mock(spec=user_pkg.services.PasswordResetUpsert)
        manager.send_password_reset_request_mail = mock.Mock(spec=mail_pkg.services.SendPasswordResetRequestMail)

        request_password_reset = user_pkg.services.RequestPasswordReset(
            email_to_id=manager.email_to_id,
            generate_secret=manager.generate_secret,
            timezone_now=manager.timezone_now,
            atomic_transaction=manager.atomic_transaction,
            upsert_password_reset=manager.upsert_password_reset,
            send_password_reset_request_mail=manager.send_password_reset_request_mail,
        )
        request_password_reset(requester_email)

        assert manager.mock_calls == [
            mock.call.email_to_id(requester_email),
            mock.call.generate_secret(),
            mock.call.timezone_now(),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.upsert_password_reset(user_id, password_reset_token, timestamp),
            mock.call.send_password_reset_request_mail(requester_email, password_reset_token),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        requester_email = fake.unique.ascii_safe_email()

        manager = mock.Mock()
        manager.email_to_id = mock.Mock(spec=user_pkg.services.EmailToID, side_effect=[None])
        manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret)
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now)
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.upsert_password_reset = mock.Mock(spec=user_pkg.services.PasswordResetUpsert)
        manager.send_password_reset_request_mail = mock.Mock(spec=mail_pkg.services.SendPasswordResetRequestMail)

        request_password_reset = user_pkg.services.RequestPasswordReset(
            email_to_id=manager.email_to_id,
            generate_secret=manager.generate_secret,
            timezone_now=manager.timezone_now,
            atomic_transaction=manager.atomic_transaction,
            upsert_password_reset=manager.upsert_password_reset,
            send_password_reset_request_mail=manager.send_password_reset_request_mail,
        )
        with pytest.raises(user_pkg.exceptions.UserWithEmailDoesNotExist):
            request_password_reset(requester_email)

        assert manager.mock_calls == [
            mock.call.email_to_id(requester_email),
        ]


class TestResolvePasswordReset:
    def test_success(self) -> None:
        fake = Faker()
        requester_id = id_token.generate()
        password = fake.unique.password()

        password_reset_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_password_reset = mock.Mock(
            spec=user_pkg.services.PasswordResetGet,
            side_effect=[user_pkg.types.PasswordReset(
                user_id=requester_id,
                requested_at=timestamp,
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.update_password = mock.Mock(spec=user_pkg.services.PasswordUpdate)
        manager.delete_password_reset = mock.Mock(spec=user_pkg.services.PasswordResetDelete)

        resolve_password_reset = user_pkg.services.ResolvePasswordReset(
            get_password_reset=manager.get_password_reset,
            timezone_now=manager.timezone_now,
            atomic_transaction=manager.atomic_transaction,
            update_password=manager.update_password,
            delete_password_reset=manager.delete_password_reset,
        )
        resolve_password_reset(password_reset_token, password)

        assert manager.mock_calls == [
            mock.call.get_password_reset(password_reset_token),
            mock.call.timezone_now(),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.update_password(requester_id, password),
            mock.call.delete_password_reset(password_reset_token),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__password_reset_does_not_exist(self) -> None:
        fake = Faker()
        password = fake.unique.password()

        password_reset_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_password_reset = mock.Mock(
            spec=user_pkg.services.PasswordResetGet,
            side_effect=user_pkg.exceptions.PasswordResetDoesNotExist(password_reset_token),
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp])
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.update_password = mock.Mock(spec=user_pkg.services.PasswordUpdate)
        manager.delete_password_reset = mock.Mock(spec=user_pkg.services.PasswordResetDelete)

        with pytest.raises(user_pkg.exceptions.PasswordResetDoesNotExist):
            resolve_password_reset = user_pkg.services.ResolvePasswordReset(
                get_password_reset=manager.get_password_reset,
                timezone_now=manager.timezone_now,
                atomic_transaction=manager.atomic_transaction,
                update_password=manager.update_password,
                delete_password_reset=manager.delete_password_reset,
            )
            resolve_password_reset(password_reset_token, password)

        assert manager.mock_calls == [
            mock.call.get_password_reset(password_reset_token),
        ]

    def test_failure__password_reset_expired(self) -> None:
        fake = Faker()
        requester_id = id_token.generate()
        password = fake.unique.password()

        password_reset_token = secret_token.generate()
        timestamp = datetime(year=2222, month=2, day=22, hour=22, minute=22, second=22)

        manager = mock.Mock()
        manager.get_password_reset = mock.Mock(
            spec=user_pkg.services.PasswordResetGet,
            side_effect=[user_pkg.types.PasswordReset(
                user_id=requester_id,
                requested_at=timestamp,
            )],
        )
        manager.timezone_now = mock.Mock(spec=core_pkg.services.timezone.Now, side_effect=[timestamp + timedelta(days=2, microseconds=1)])
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic)
        manager.update_password = mock.Mock(spec=user_pkg.services.PasswordUpdate)
        manager.delete_password_reset = mock.Mock(spec=user_pkg.services.PasswordResetDelete)

        with pytest.raises(user_pkg.exceptions.PasswordResetExpired):
            resolve_password_reset = user_pkg.services.ResolvePasswordReset(
                timezone_now=manager.timezone_now,
                atomic_transaction=manager.atomic_transaction,
                get_password_reset=manager.get_password_reset,
                delete_password_reset=manager.delete_password_reset,
                update_password=manager.update_password,
            )
            resolve_password_reset(password_reset_token, password)

        assert manager.mock_calls == [
            mock.call.get_password_reset(password_reset_token),
            mock.call.timezone_now(),
        ]
