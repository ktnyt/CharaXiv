from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_password_reset_request_delete_by_user_id.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, user_id: UUID) -> None:
        await self.session.execute(
            sqlalchemy.delete(repositories.database.models.PasswordResetRequest)
            .where(repositories.database.models.PasswordResetRequest.user_id == user_id)
        )
