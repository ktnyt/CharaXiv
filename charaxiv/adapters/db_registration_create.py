from dataclasses import dataclass

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_registration_create.Protocol):

    session: AsyncSession

    async def __call__(self, /, *, email: str, token: str) -> None:
        self.session.add(repositories.database.models.Registration(
            token=token,
            email=email,
        ))
        await self.session.flush()
