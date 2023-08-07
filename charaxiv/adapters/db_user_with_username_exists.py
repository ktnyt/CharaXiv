from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_user_with_username_exists.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, username: str) -> bool:
        return (await self.session.execute(
            sqlalchemy.select(repositories.database.models.User)
            .filter(repositories.database.models.User.username == username)
        )).scalar_one_or_none() is not None
