import contextlib
from unittest import mock

import pytest

from charaxiv import protocols
from charaxiv.combinators.character_create_new import Combinator


@pytest.mark.asyncio
async def test_db_character_create_new() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.object_dump = mock.Mock(spec=protocols.object_dump.Protocol, side_effect=[mock.sentinel.serialized_data])
    manager.db_character_insert = mock.AsyncMock(spec=protocols.db_character_insert.Protocol, side_effect=[mock.sentinel.character_id])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        object_dump=manager.object_dump,
        db_character_insert=manager.db_character_insert,
    )

    # Execute combinator
    output = await combinator(
        owner_id=mock.sentinel.owner_id,
        system=mock.sentinel.system,
        data=mock.sentinel.data,
        omit=mock.sentinel.omit,
    )

    # Assert output (if available)
    assert output == mock.sentinel.character_id

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.object_dump(mock.sentinel.data),
        mock.call.db_character_insert(
            owner_id=mock.sentinel.owner_id,
            system=mock.sentinel.system,
            name="",
            data=mock.sentinel.serialized_data,
        ),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
