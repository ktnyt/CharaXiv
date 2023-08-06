import secrets

import pytest
import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import repositories
from charaxiv.adapters.registration_delete_by_email import Adapter


@pytest.mark.asyncio
async def test_registration_delete_by_email(database_session: AsyncSession) -> None:
    registration_model = repositories.database.models.Registration(
        token=secrets.token_urlsafe(32),
        email="test@example.com",
    )

    database_session.add(registration_model)

    adapter = Adapter(session=database_session)
    await adapter(email=registration_model.email)

    out = (await database_session.execute(
        sqlalchemy.select(repositories.database.models.Registration)
        .filter(sqlalchemy.or_(
            repositories.database.models.Registration.token == registration_model.token,
            repositories.database.models.Registration.email == registration_model.email,
        ))
    )).scalars().all()
    assert len(out) == 0
