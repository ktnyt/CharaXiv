from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.db_user_insert.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, email: str, username: str, password: str, group: types.user.Group) -> UUID:
        user_model = repositories.database.models.User(
            email=email,
            username=username,
            password=password,
            group=group,
        )
        self.session.add(user_model)
        await self.session.flush()
        return user_model.id
