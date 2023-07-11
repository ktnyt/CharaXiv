from dataclasses import dataclass
from datetime import timedelta
from uuid import UUID

from injector import inject, singleton

from charaxiv import protocols


class PasswordResetRequestNotFoundException(Exception):
    def __init__(self, /, *, token: str) -> None:
        super().__init__(f"token={token}")


class PasswordResetRequestExpiredException(Exception):
    def __init__(self, /, *, token: str) -> None:
        super().__init__(f"token={token}")


class UserPasswordUpdateWithIdFailedException(Exception):
    def __init__(self, /, *, userid: UUID) -> None:
        super().__init__(f"userid={str(userid)}")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    password_reset_request_get_by_token: protocols.password_reset_request_get_by_token.Protocol
    password_reset_request_delete: protocols.password_reset_request_delete.Protocol
    timezone_now: protocols.timezone_now.Protocol
    password_hash: protocols.password_hash.Protocol
    user_password_update_by_id: protocols.user_password_update_by_id.Protocol

    async def __call__(self, /, *, token: str, password: str) -> None:
        async with self.transaction_atomic():
            password_reset_request = await self.password_reset_request_get_by_token(token=token)
            if password_reset_request is None:
                raise PasswordResetRequestNotFoundException(token=token)

            await self.password_reset_request_delete(token=token)

            if password_reset_request.created_at + timedelta(days=1) < self.timezone_now():
                raise PasswordResetRequestExpiredException(token=token)

            hashedpw = self.password_hash(password=password)
            updated = await self.user_password_update_by_id(
                userid=password_reset_request.userid,
                password=hashedpw,
            )

            if not updated:
                raise UserPasswordUpdateWithIdFailedException(userid=password_reset_request.userid)