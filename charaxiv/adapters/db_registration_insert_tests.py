import secrets

import pytest
import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import repositories
from charaxiv.adapters.db_registration_insert import Adapter


@pytest.mark.asyncio
async def test_db_registration_insert(database_session: AsyncSession) -> None:
    email = "text@example.com"
    token = secrets.token_urlsafe(32)

    adapter = Adapter(session=database_session)
    await adapter(email=email, token=token)
    await database_session.flush()

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Registration)
        .filter(
            repositories.database.models.Registration.token == token,
            repositories.database.models.Registration.email == email,
        )
    )).scalar_one()

    assert out.email == email
    assert out.token == token
