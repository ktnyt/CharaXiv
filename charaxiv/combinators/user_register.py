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
    user_with_email_exists: protocols.user_with_email_exists.Protocol
    secret_token_generate: protocols.secret_token_generate.Protocol
    registration_exists: protocols.registration_exists.Protocol
    registration_delete_by_email: protocols.registration_delete_by_email.Protocol
    registration_create: protocols.registration_create.Protocol
    user_registration_mail_send: combinators.user_registration_mail_send.Combinator

    async def __call__(self, /, *, email: str) -> None:
        async with self.transaction_atomic():
            if await self.user_with_email_exists(email=email):
                raise UserWithEmailExistsException(email)

            if await self.registration_exists(email=email):
                await self.registration_delete_by_email(email=email)

            token = self.secret_token_generate()

            await self.registration_create(email=email, token=token)
            await self.user_registration_mail_send(email=email, token=token)
