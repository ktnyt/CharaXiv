import secrets

import pytest
import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, repositories
from charaxiv.adapters.db_registration_delete_by_token import Adapter


@pytest.mark.asyncio
async def test_db_registration_delete_by_token(database_session: AsyncSession) -> None:
    email = "test@example.com"
    token = secrets.token_urlsafe(32)

    await adapters.db_registration_insert.Adapter(session=database_session)(
        email=email,
        token=token
    )

    adapter = Adapter(session=database_session)
    await adapter(token=token)

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Registration)
        .filter(sqlalchemy.or_(
            repositories.database.models.Registration.token == token,
            repositories.database.models.Registration.email == email,
        ))
    )).scalars().all()
    assert len(out) == 0
