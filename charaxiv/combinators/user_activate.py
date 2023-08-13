from dataclasses import dataclass
from datetime import timedelta

from injector import inject, singleton

from charaxiv import combinators, protocols, types

UserWithEmailExistsException = combinators.user_register.UserWithEmailExistsException


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
    db_registration_select_by_token: protocols.db_registration_select_by_token.Protocol
    db_user_with_email_exists: protocols.db_user_with_email_exists.Protocol
    db_user_with_username_exists: protocols.db_user_with_username_exists.Protocol
    db_registration_delete_by_token: protocols.db_registration_delete_by_token.Protocol
    timezone_now: protocols.timezone_now.Protocol
    datetime_diff_gt: protocols.datetime_diff_gt.Protocol
    password_hash: protocols.password_hash.Protocol
    db_user_insert: protocols.db_user_insert.Protocol

    async def __call__(self, /, *, token: str, username: str, password: str) -> None:
        async with self.transaction_atomic():
            registration = await self.db_registration_select_by_token(token=token)
            if registration is None:
                raise RegistrationNotFoundException(token=token)

            if await self.db_user_with_email_exists(email=registration.email):
                raise UserWithEmailExistsException(email=registration.email)

            if await self.db_user_with_username_exists(username=username):
                raise UserWithUsernameExistsException(username=username)

            await self.db_registration_delete_by_token(token=token)

            current_time = self.timezone_now()
            if self.datetime_diff_gt(registration.created_at, current_time, timedelta(days=1)):
                raise RegistrationExpiredException(token=token)

            hashedpw = self.password_hash(password=password)
            await self.db_user_insert(
                email=registration.email,
                username=username,
                password=hashedpw,
                group=types.user.Group.BASE,
            )
