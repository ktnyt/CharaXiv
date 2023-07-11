from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.user_with_email_exists.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, email: str) -> bool:
        return (await self.session.execute(
            sqlalchemy.select(repositories.database.models.User)
            .filter(repositories.database.models.User.email == email)
        )).scalar_one_or_none() is not None
