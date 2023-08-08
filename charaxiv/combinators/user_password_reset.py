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
    def __init__(self, /, *, user_id: UUID) -> None:
        super().__init__(f"user_id={str(user_id)}")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    db_password_reset_request_get_by_token: protocols.db_password_reset_request_select_by_token.Protocol
    db_password_reset_request_delete: protocols.db_password_reset_request_delete.Protocol
    timezone_now: protocols.timezone_now.Protocol
    password_hash: protocols.password_hash.Protocol
    db_user_password_update_by_id: protocols.db_user_password_update_by_id.Protocol

    async def __call__(self, /, *, token: str, password: str) -> None:
        async with self.transaction_atomic():
            password_reset_request = await self.db_password_reset_request_select_by_token(token=token)
            if password_reset_request is None:
                raise PasswordResetRequestNotFoundException(token=token)

            await self.db_password_reset_request_delete(token=token)

            if password_reset_request.created_at + timedelta(days=1) < self.timezone_now():
                raise PasswordResetRequestExpiredException(token=token)

            hashedpw = self.password_hash(password=password)
            updated = await self.db_user_password_update_by_id(
                user_id=password_reset_request.user_id,
                password=hashedpw,
            )

            if not updated:
                raise UserPasswordUpdateWithIdFailedException(user_id=password_reset_request.user_id)
