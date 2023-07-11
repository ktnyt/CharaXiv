from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols, repositories


@singleton
@inject
@dataclass
class Adapter(protocols.password_reset_request_create.Protocol):
    session: AsyncSession

    async def __call__(self, /, *, userid: UUID, token: str) -> None:
        self.session.add(repositories.database.models.PasswordResetRequest(
            token=token,
            userid=userid,
        ))
