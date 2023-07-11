import typing

import pytest
import pytest_asyncio
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import (AsyncSession, async_sessionmaker,
                                    create_async_engine)

from charaxiv import repositories, settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)


@pytest_asyncio.fixture(scope="function")
async def database_session() -> typing.AsyncGenerator[AsyncSession, typing.Any]:
    session_maker = async_sessionmaker(engine, expire_on_commit=False)
    async with session_maker() as session:
        conn = await session.connection()
        await conn.run_sync(repositories.database.models.Base.metadata.drop_all)
        await conn.run_sync(repositories.database.models.Base.metadata.create_all)
        yield session

    await engine.dispose()


@pytest.fixture(scope="function")
def password_hasher() -> PasswordHasher:
    return PasswordHasher(
        time_cost=2,  # 2 iterations
        memory_cost=19*1024,  # 19 * 1024 KiB = 19 MiB
        parallelism=1,  # 1 thread
    )
