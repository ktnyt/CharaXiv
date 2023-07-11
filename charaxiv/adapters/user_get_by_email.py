import typing
from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.user_get_by_email.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, email: str) -> typing.Optional[types.user.User]:
        user_model = (await self.session.execute(
            sqlalchemy.select(repositories.database.models.User)
            .filter(repositories.database.models.User.email == email)
        )).scalar_one_or_none()
        return types.user.User(
            id=user_model.id,
            email=user_model.email,
            username=user_model.username,
            password=user_model.password,
            group=user_model.group,
        ) if user_model else None
