import typing
from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.password_reset_request_get_by_token.Protocol):
    session: AsyncSession
    timezone_aware: protocols.timezone_aware.Protocol

    async def __call__(self, /, *, token: str) -> typing.Optional[types.password_reset.PasswordResetRequest]:
        password_reset_request_model = (await self.session.execute(
            sqlalchemy.select(repositories.database.models.PasswordResetRequest)
            .filter(repositories.database.models.PasswordResetRequest.token == token)
        )).scalar_one_or_none()
        if password_reset_request_model is None:
            return password_reset_request_model
        return types.password_reset.PasswordResetRequest(
            userid=password_reset_request_model.userid,
            created_at=self.timezone_aware(password_reset_request_model.created_at),
        )
