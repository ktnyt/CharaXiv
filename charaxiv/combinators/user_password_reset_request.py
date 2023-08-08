from dataclasses import dataclass

from injector import inject, singleton

from charaxiv import combinators, protocols


class UserWithEmailNotFoundException(Exception):
    def __init__(self, email: str) -> None:
        super().__init__(f"email={email}")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    db_user_get_by_email: protocols.db_user_select_by_email.Protocol
    user_password_reset_exists: protocols.db_password_reset_request_exists.Protocol
    user_password_reset_delete: protocols.db_password_reset_request_delete.Protocol
    secret_token_generate: protocols.secret_token_generate.Protocol
    user_password_reset_create: protocols.db_password_reset_request_create.Protocol
    user_password_reset_mail_send: combinators.user_password_reset_mail_send.Combinator

    async def __call__(self, /, *, email: str) -> None:
        async with self.transaction_atomic():
            user = await self.db_user_select_by_email(email=email)
            if not user:
                raise UserWithEmailNotFoundException(email)

            if await self.user_password_reset_exists(user_id=user.id):
                await self.user_password_reset_delete(user_id=user.id)

            token = self.secret_token_generate()

            await self.user_password_reset_create(user_id=user.id, token=token)
            await self.user_password_reset_mail_send(email=email, token=token)
