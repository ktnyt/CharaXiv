from datetime import datetime
from typing import Optional

from injector import Binder, InstanceProvider

from lib import id_token
from src import user_pkg
from src.decorators import implements

from .models import PasswordReset, Registration, User


@implements(user_pkg.services.EmailExists)
def email_exists(email: str) -> bool:
    return User.objects.filter(email=email).exists()


@implements(user_pkg.services.UsernameExists)
def username_exists(name: user_pkg.types.Name) -> bool:
    return User.objects.filter(name_key=name.key, name_tag=name.tag).exists()


@implements(user_pkg.services.EmailToID)
def email_to_id(email: str) -> id_token.IDToken:
    try:
        user = User.objects.get(email=email)
        return id_token.IDToken.from_uuid(user.id)

    except User.DoesNotExist as e:
        raise user_pkg.exceptions.UserWithEmailDoesNotExist(email=email) from e


@implements(user_pkg.services.UserCreate)
def user_create(user: user_pkg.types.User, password: str) -> None:
    if email_exists(user.email):
        raise user_pkg.exceptions.UserWithEmailAlreadyExists(email=user.email)

    if username_exists(user.name):
        raise user_pkg.exceptions.UserWithNameAlreadyExists(userid=user.name)

    User.objects.create_user(
        id=user.id,
        email=user.email,
        name_key=user.name.key,
        name_tag=user.name.tag,
        password=password,
    )


@implements(user_pkg.services.UsernameUpdate)
def username_update(user_id: id_token.IDToken, name: user_pkg.types.Name) -> None:
    try:
        user = User.objects.get(id=user_id.to_uuid())

    except User.DoesNotExist as e:
        raise user_pkg.exceptions.UserWithIDDoesNotExist(user_id=user_id) from e

    if username_exists(name) and (user.name_key != name.key or user.name_tag != name.tag):
        raise user_pkg.exceptions.UserWithNameAlreadyExists(userid=name)

    user.name_key = name.key
    user.name_tag = name.tag
    user.save()


@implements(user_pkg.services.PasswordUpdate)
def password_update(user_id: id_token.IDToken, password: str) -> None:
    try:
        user = User.objects.get(id=user_id.to_uuid())
        user.set_password(password)
        user.save()

    except User.DoesNotExist as e:
        raise user_pkg.exceptions.UserWithIDDoesNotExist(user_id=user_id) from e


@implements(user_pkg.services.RegistrationUpsert)
def registration_upsert(email: str, registration_token: str, timestamp: datetime) -> None:
    try:
        registration = Registration.objects.get(email=email)

    except Registration.DoesNotExist:
        registration = Registration(email=email)

    registration.token = registration_token
    registration.registered_at = timestamp
    registration.save()


@implements(user_pkg.services.RegistrationGet)
def registration_get(registration_token: str) -> Optional[user_pkg.types.Registration]:
    try:
        registration = Registration.objects.get(token=registration_token)
        return user_pkg.types.Registration(
            email=registration.email,
            registered_at=registration.registered_at,
        )

    except Registration.DoesNotExist:
        return None


@implements(user_pkg.services.RegistrationDelete)
def registration_delete(registration_token: str) -> None:
    try:
        registration = Registration.objects.get(token=registration_token)
        registration.delete()

    except Registration.DoesNotExist as e:
        raise user_pkg.exceptions.RegistrationDoesNotExist(token=registration_token) from e


@implements(user_pkg.services.PasswordResetUpsert)
def password_reset_upsert(user_id: id_token.IDToken, password_reset_token: str, timestamp: datetime) -> None:
    try:
        user = User.objects.get(id=user_id.to_uuid())

    except User.DoesNotExist as e:
        raise user_pkg.exceptions.UserWithIDDoesNotExist(user_id=user_id) from e

    try:
        password_reset = PasswordReset.objects.get(user=user)

    except PasswordReset.DoesNotExist:
        password_reset = PasswordReset(user=user)

    password_reset.token = password_reset_token
    password_reset.requested_at = timestamp
    password_reset.save()


@implements(user_pkg.services.PasswordResetGet)
def password_reset_get(password_reset_token: str) -> user_pkg.types.PasswordReset:
    try:
        password_reset = PasswordReset.objects.prefetch_related('user').get(token=password_reset_token)
        return user_pkg.types.PasswordReset(
            user_id=id_token.IDToken.from_uuid(password_reset.user.id),
            requested_at=password_reset.requested_at,
        )

    except PasswordReset.DoesNotExist as e:
        raise user_pkg.exceptions.PasswordResetDoesNotExist(token=password_reset_token) from e


@implements(user_pkg.services.PasswordResetDelete)
def password_reset_delete(password_reset_token: str) -> None:
    try:
        password_reset = PasswordReset.objects.get(token=password_reset_token)
        password_reset.delete()

    except PasswordReset.DoesNotExist as e:
        raise user_pkg.exceptions.PasswordResetDoesNotExist(token=password_reset_token) from e


def configure(binder: Binder) -> None:
    binder.bind(user_pkg.services.EmailExists, to=InstanceProvider(email_exists))
    binder.bind(user_pkg.services.UsernameExists, to=InstanceProvider(username_exists))
    binder.bind(user_pkg.services.EmailToID, to=InstanceProvider(email_to_id))
    binder.bind(user_pkg.services.UserCreate, to=InstanceProvider(user_create))
    binder.bind(user_pkg.services.UsernameUpdate, to=InstanceProvider(username_update))
    binder.bind(user_pkg.services.PasswordUpdate, to=InstanceProvider(password_update))
    binder.bind(user_pkg.services.RegistrationUpsert, to=InstanceProvider(registration_upsert))
    binder.bind(user_pkg.services.RegistrationGet, to=InstanceProvider(registration_get))
    binder.bind(user_pkg.services.RegistrationDelete, to=InstanceProvider(registration_delete))
    binder.bind(user_pkg.services.PasswordResetUpsert, to=InstanceProvider(password_reset_upsert))
    binder.bind(user_pkg.services.PasswordResetGet, to=InstanceProvider(password_reset_get))
    binder.bind(user_pkg.services.PasswordResetDelete, to=InstanceProvider(password_reset_delete))
