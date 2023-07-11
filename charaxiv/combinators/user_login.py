from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton

from charaxiv import protocols


class UserVerificationException(Exception):
    def __init__(self, email: str) -> None:
        super().__init__(f"Failed to validate user with email='{email}'")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    user_get_by_email: protocols.user_get_by_email.Protocol
    password_verify: protocols.password_verify.Protocol

    async def __call__(self, /, *, email: str, password: str) -> UUID:
        async with self.transaction_atomic():
            user = await self.user_get_by_email(email=email)
            if user is None:
                raise UserVerificationException(email)
            if not self.password_verify(hash=user.password, password=password):
                raise UserVerificationException(email)
            return user.id
