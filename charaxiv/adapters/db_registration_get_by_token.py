import typing
from dataclasses import dataclass

import sqlalchemy
from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories, types


@singleton
@inject
@dataclass
class Adapter(protocols.db_registration_get_by_token.Protocol):
    session: AsyncSession
    timezone_aware: protocols.timezone_aware.Protocol

    async def __call__(self, /, *, token: str) -> typing.Optional[types.registration.Registration]:
        model = (await self.session.execute(
            sqlalchemy.select(repositories.database.models.Registration)
            .filter(repositories.database.models.Registration.token == token)
        )).scalar_one_or_none()
        if model is None:
            return None
        return types.registration.Registration(
            email=model.email,
            created_at=self.timezone_aware(model.created_at),
        )
