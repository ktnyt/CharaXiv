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
    db_user_select_by_email: protocols.db_user_select_by_email.Protocol
    db_password_reset_request_exists: protocols.db_password_reset_request_exists.Protocol
    db_password_reset_request_delete_by_user_id: protocols.db_password_reset_request_delete_by_user_id.Protocol
    secret_token_generate: protocols.secret_token_generate.Protocol
    db_password_reset_request_create: protocols.db_password_reset_request_insert.Protocol
    password_reset_mail_send: combinators.password_reset_mail_send.Combinator

    async def __call__(self, /, *, email: str) -> None:
        async with self.transaction_atomic():
            user = await self.db_user_select_by_email(email=email)
            if not user:
                raise UserWithEmailNotFoundException(email)

            if await self.db_password_reset_request_exists(user_id=user.id):
                await self.db_password_reset_request_delete_by_user_id(user_id=user.id)

            token = self.secret_token_generate()

            await self.db_password_reset_request_create(user_id=user.id, token=token)
            await self.password_reset_mail_send(email=email, token=token)
