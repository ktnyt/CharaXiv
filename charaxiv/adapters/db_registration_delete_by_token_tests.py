import secrets

import pytest
import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import repositories
from charaxiv.adapters.db_registration_delete_by_token import Adapter


@pytest.mark.asyncio
async def test_db_registration_delete_by_token(database_session: AsyncSession) -> None:
    db_registration_model = repositories.database.models.Registration(
        token=secrets.token_urlsafe(32),
        email="test@example.com",
    )

    database_session.add(db_registration_model)

    adapter = Adapter(session=database_session)
    await adapter(token=db_registration_model.token)

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Registration)
        .filter(sqlalchemy.or_(
            repositories.database.models.Registration.token == db_registration_model.token,
            repositories.database.models.Registration.email == db_registration_model.email,
        ))
    )).scalars().all()
    assert len(out) == 0
