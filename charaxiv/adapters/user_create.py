from dataclasses import dataclass

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.user_create.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, email: str, username: str, password: str) -> None:
        self.session.add(repositories.database.models.User(
            email=email,
            username=username,
            password=password,
        ))
