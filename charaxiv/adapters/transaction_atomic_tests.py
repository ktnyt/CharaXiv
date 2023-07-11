from unittest import mock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv.adapters.transaction_atomic import Adapter


@pytest.mark.asyncio
async def test_transaction_atomic__commit() -> None:
    manager = mock.Mock()
    manager.session = mock.AsyncMock(spec=AsyncSession)

    adapter = Adapter(manager.session)

    async with adapter():
        pass

    assert manager.mock_calls == [
        mock.call.session.__aenter__(),
        mock.call.session.commit(),
        mock.call.session.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_transaction_atomic__rollback() -> None:
    manager = mock.Mock()
    manager.session = mock.AsyncMock(spec=AsyncSession)

    adapter = Adapter(manager.session)

    exc = Exception("exception")

    with pytest.raises(Exception):
        async with adapter():
            raise exc

    assert manager.mock_calls == [
        mock.call.session.__aenter__(),
        mock.call.session.rollback(),
        mock.call.session.__aexit__(Exception, exc, mock.ANY),
    ]
