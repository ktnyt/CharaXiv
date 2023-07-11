import contextlib
import typing
from dataclasses import dataclass

from injector import inject
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import protocols


@inject
@dataclass
class Adapter(protocols.transaction_atomic.Protocol):
    session: AsyncSession

    @contextlib.asynccontextmanager
    async def __call__(self) -> typing.AsyncIterator[None]:
        async with self.session:
            try:
                yield
                await self.session.commit()
            except Exception as e:
                await self.session.rollback()
                raise e
