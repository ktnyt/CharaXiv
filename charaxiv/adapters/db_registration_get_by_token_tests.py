import secrets

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import lib, repositories, types
from charaxiv.adapters.db_registration_get_by_token import Adapter


@pytest.mark.asyncio
async def test_db_registration_get_by_token(database_session: AsyncSession) -> None:
    token = secrets.token_urlsafe(32)

    adapter = Adapter(session=database_session, timezone_aware=lib.timezone.aware)

    out = await adapter(token=token)
    assert out is None

    db_registration_model = repositories.database.models.Registration(
        token=token,
        email="test@example.com",
    )

    database_session.add(db_registration_model)
    await database_session.flush()

    out = await adapter(token=token)
    assert out == types.registration.Registration(
        email=db_registration_model.email,
        created_at=lib.timezone.aware(db_registration_model.created_at),
    )
