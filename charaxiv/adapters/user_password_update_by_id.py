from dataclasses import dataclass
from uuid import UUID

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.user_password_update_by_id.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, userid: UUID, password: str) -> bool:
        result = (await self.session.execute(
            sqlalchemy.update(repositories.database.models.User)
            .where(repositories.database.models.User.id == userid)
            .values(password=password)
        ))
        assert type(result) == sqlalchemy.CursorResult
        return result.rowcount == 1
