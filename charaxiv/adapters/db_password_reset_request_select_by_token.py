import typing
from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.db_password_reset_request_select_by_token.Protocol):
    session: AsyncSession
    timezone_aware: protocols.timezone_aware.Protocol

    async def __call__(self, /, *, token: str) -> typing.Optional[types.password_reset.PasswordResetRequest]:
        db_password_reset_request_model = (await self.session.execute(
            sqlalchemy.select(repositories.database.models.PasswordResetRequest)
            .filter(repositories.database.models.PasswordResetRequest.token == token)
        )).scalar_one_or_none()
        if db_password_reset_request_model is None:
            return db_password_reset_request_model
        return types.password_reset.PasswordResetRequest(
            user_id=db_password_reset_request_model.user_id,
            created_at=self.timezone_aware(db_password_reset_request_model.created_at),
        )
