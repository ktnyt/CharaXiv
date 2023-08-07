from dataclasses import dataclass

from injector import inject, singleton

from charaxiv import combinators, protocols


class UserWithEmailExistsException(Exception):
    def __init__(self, email: str) -> None:
        super().__init__(f"email={email}")


@singleton
@inject
@dataclass
class Combinator:
    transaction_atomic: protocols.transaction_atomic.Protocol
    db_user_with_email_exists: protocols.db_user_with_email_exists.Protocol
    secret_token_generate: protocols.secret_token_generate.Protocol
    db_registration_exists: protocols.db_registration_exists.Protocol
    db_registration_delete_by_email: protocols.db_registration_delete_by_email.Protocol
    db_registration_create: protocols.db_registration_create.Protocol
    user_registration_mail_send: combinators.user_registration_mail_send.Combinator

    async def __call__(self, /, *, email: str) -> None:
        async with self.transaction_atomic():
            if await self.db_user_with_email_exists(email=email):
                raise UserWithEmailExistsException(email)

            if await self.db_registration_exists(email=email):
                await self.db_registration_delete_by_email(email=email)

            token = self.secret_token_generate()

            await self.db_registration_create(email=email, token=token)
            await self.user_registration_mail_send(email=email, token=token)
