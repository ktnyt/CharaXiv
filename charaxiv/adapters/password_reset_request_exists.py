from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.password_reset_request_exists.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, userid: UUID) -> bool:
        return (await self.session.execute(
            sqlalchemy.select(repositories.database.models.PasswordResetRequest)
            .filter(repositories.database.models.PasswordResetRequest.userid == userid)
        )).scalar_one_or_none() is not None
