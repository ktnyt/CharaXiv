import secrets

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import repositories
from charaxiv.adapters.db_registration_exists import Adapter


@pytest.mark.asyncio
async def test_db_registration_exists(database_session: AsyncSession) -> None:
    adapter = Adapter(session=database_session)
    out = await adapter(email="test@example.com")
    assert not out

    registration = repositories.database.models.Registration(
        email="test@example.com",
        token=secrets.token_urlsafe(32),
    )

    database_session.add(registration)
    await database_session.flush()

    adapter = Adapter(session=database_session)
    out = await adapter(email="test@example.com")
    assert out
