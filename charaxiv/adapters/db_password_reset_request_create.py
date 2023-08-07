from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.db_password_reset_request_create.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, user_id: UUID, token: str) -> None:
        self.session.add(repositories.database.models.PasswordResetRequest(
            token=token,
            user_id=user_id,
        ))
        await self.session.flush()
