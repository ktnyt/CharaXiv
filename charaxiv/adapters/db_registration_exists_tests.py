import secrets

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters
from charaxiv.adapters.db_registration_exists import Adapter


@pytest.mark.asyncio
async def test_db_registration_exists(database_session: AsyncSession) -> None:
    email = "test@example.com"
    token = secrets.token_urlsafe(32)

    adapter = Adapter(session=database_session)
    out = await adapter(email=email)
    assert not out

    await adapters.db_registration_insert.Adapter(session=database_session)(
        email=email,
        token=token
    )

    adapter = Adapter(session=database_session)
    out = await adapter(email=email)
    assert out
