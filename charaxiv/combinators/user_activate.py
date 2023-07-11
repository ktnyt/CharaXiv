from dataclasses import dataclass
from datetime import timedelta

from injector import inject, singleton

from charaxiv import protocols
from charaxiv.combinators.user_register import UserWithEmailExistsException


class RegistrationNotFoundException(Exception):
    def __init__(self, /, *, token: str) -> None:
        super().__init__(f"token={token}")


class UserWithUsernameExistsException(Exception):
    def __init__(self, /, *, username: str) -> None:
        super().__init__(f"username={username}")


class RegistrationExpiredException(Exception):
    def __init__(self, /, *, token: str) -> None:
        super().__init__(f"token={token}")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    registration_get_by_token: protocols.registration_get_by_token.Protocol
    user_with_email_exists: protocols.user_with_email_exists.Protocol
    user_with_username_exists: protocols.user_with_username_exists.Protocol
    timezone_now: protocols.timezone_now.Protocol
    registration_delete: protocols.registration_delete.Protocol
    password_hash: protocols.password_hash.Protocol
    user_create: protocols.user_create.Protocol

    async def __call__(self, /, *, token: str, username: str, password: str) -> None:
        async with self.transaction_atomic():
            registration = await self.registration_get_by_token(token=token)
            if registration is None:
                raise RegistrationNotFoundException(token=token)

            if await self.user_with_email_exists(email=registration.email):
                raise UserWithEmailExistsException(email=registration.email)

            if await self.user_with_username_exists(username=username):
                raise UserWithUsernameExistsException(username=username)

            await self.registration_delete(token=token)

            if registration.created_at + timedelta(days=1) < self.timezone_now():
                raise RegistrationExpiredException(token=token)

            hashedpw = self.password_hash(password=password)
            await self.user_create(
                email=registration.email,
                username=username,
                password=hashedpw,
            )
