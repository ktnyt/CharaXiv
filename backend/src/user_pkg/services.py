from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional, Protocol, runtime_checkable

from injector import inject

from lib import id_token
from src import core_pkg, mail_pkg

from . import exceptions as user_exceptions
from . import types as user_types


@runtime_checkable
class EmailExists(Protocol):
    def __call__(self, email: str) -> bool: ...


@runtime_checkable
class UsernameExists(Protocol):
    def __call__(self, name: user_types.Name) -> bool: ...


@runtime_checkable
class EmailToID(Protocol):
    def __call__(self, email: str) -> Optional[id_token.IDToken]: ...


@runtime_checkable
class UserCreate(Protocol):
    def __call__(self, user: user_types.User, password: str) -> None: ...


@runtime_checkable
class UsernameUpdate(Protocol):
    def __call__(self, user_id: id_token.IDToken, name: user_types.Name) -> None: ...


@runtime_checkable
class PasswordUpdate(Protocol):
    def __call__(self, user_id: id_token.IDToken, password: str) -> None: ...


@runtime_checkable
class RegistrationUpsert(Protocol):
    def __call__(self, email: str, registration_token: str, timestamp: datetime) -> None: ...


@runtime_checkable
class RegistrationGet(Protocol):
    def __call__(self, registration_token: str) -> Optional[user_types.Registration]: ...


@runtime_checkable
class RegistrationDelete(Protocol):
    def __call__(self, registration_token: str) -> None: ...


@runtime_checkable
class PasswordResetUpsert(Protocol):
    def __call__(self, user_id: id_token.IDToken, password_reset_token: str, timestamp: datetime) -> None: ...


@runtime_checkable
class PasswordResetGet(Protocol):
    def __call__(self, password_reset_token: str) -> user_types.PasswordReset: ...


@runtime_checkable
class PasswordResetDelete(Protocol):
    def __call__(self, password_reset_token: str) -> None: ...


@inject
@dataclass
class Register:
    user_exists: EmailExists
    generate_secret: core_pkg.services.token.GenerateSecret
    timezone_now: core_pkg.services.timezone.Now
    atomic_transaction: core_pkg.services.transaction.Atomic
    upsert_registration: RegistrationUpsert
    send_registration_notification_mail: mail_pkg.services.SendRegistrationNotificationMail

    def __call__(self, registrant_email: str) -> None:
        if self.user_exists(registrant_email):
            raise user_exceptions.UserWithEmailAlreadyExists(registrant_email)
        registration_token = self.generate_secret()
        timestamp = self.timezone_now()
        with self.atomic_transaction():
            self.upsert_registration(registrant_email, registration_token, timestamp)
            self.send_registration_notification_mail(registrant_email, registration_token)


@inject
@dataclass
class Activate:
    get_registration: RegistrationGet
    timezone_now: core_pkg.services.timezone.Now
    email_exists: EmailExists
    username_exists: UsernameExists
    generate_id: core_pkg.services.token.GenerateID
    atomic_transaction: core_pkg.services.transaction.Atomic
    create_user: UserCreate
    delete_registration: RegistrationDelete

    def __call__(self, registration_token: str, name: user_types.Name, password: str) -> None:
        registration = self.get_registration(registration_token)
        if registration is None:
            raise user_exceptions.RegistrationDoesNotExist(registration_token)

        if registration.registered_at + timedelta(days=2) < self.timezone_now():
            raise user_exceptions.RegistrationExpired(registration_token)

        if self.email_exists(registration.email):
            raise user_exceptions.UserWithEmailAlreadyExists(email=registration.email)

        if self.username_exists(name):
            raise user_exceptions.UserWithNameAlreadyExists(userid=name)

        id = self.generate_id()

        with self.atomic_transaction():
            self.create_user(user_types.User(
                id=id,
                email=registration.email,
                name=name,
            ), password)
            self.delete_registration(registration_token)


@inject
@dataclass
class RequestPasswordReset:
    email_to_id: EmailToID
    generate_secret: core_pkg.services.token.GenerateSecret
    timezone_now: core_pkg.services.timezone.Now
    atomic_transaction: core_pkg.services.transaction.Atomic
    upsert_password_reset: PasswordResetUpsert
    send_password_reset_request_mail: mail_pkg.services.SendPasswordResetRequestMail

    def __call__(self, requester_email: str) -> None:
        requester_id = self.email_to_id(requester_email)
        if requester_id is None:
            raise user_exceptions.UserWithEmailDoesNotExist(requester_email)
        password_reset_token = self.generate_secret()
        timestamp = self.timezone_now()
        with self.atomic_transaction():
            self.upsert_password_reset(requester_id, password_reset_token, timestamp)
            self.send_password_reset_request_mail(requester_email, password_reset_token)


@inject
@dataclass
class ResolvePasswordReset:
    get_password_reset: PasswordResetGet
    timezone_now: core_pkg.services.timezone.Now
    atomic_transaction: core_pkg.services.transaction.Atomic
    update_password: PasswordUpdate
    delete_password_reset: PasswordResetDelete

    def __call__(self, password_reset_token: str, password: str) -> None:
        password_reset = self.get_password_reset(password_reset_token)

        if password_reset.requested_at + timedelta(days=2) < self.timezone_now():
            raise user_exceptions.PasswordResetExpired(password_reset_token)

        with self.atomic_transaction():
            self.update_password(password_reset.user_id, password)
            self.delete_password_reset(password_reset_token)
