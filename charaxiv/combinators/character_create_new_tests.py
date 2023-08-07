import contextlib
from unittest import mock

import orjson
import pytest
from uuid6 import uuid7

from charaxiv import protocols, types
from charaxiv.combinators.character_create_new import Combinator


@pytest.mark.asyncio
async def test_character_create_new() -> None:
    # Setup data
    owner_id = uuid7()
    system = types.system.System.EMOKLORE
    data = dict(public="public notes", secret="secret notes")
    serialized_data = orjson.dumps(data)
    character_id = uuid7()

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.object_dump = mock.Mock(spec=protocols.object_dump.Protocol, side_effect=orjson.dumps)
    manager.character_create = mock.AsyncMock(spec=protocols.character_create.Protocol, side_effect=[character_id])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        object_dump=manager.object_dump,
        character_create=manager.character_create,
    )

    # Execute combinator
    output = await combinator(
        owner_id=owner_id,
        system=system,
        data=data,
    )

    # Assert output (if available)
    assert output.to_uuid() == character_id

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.object_dump(data),
        mock.call.character_create(
            owner_id=owner_id,
            system=system,
            name="",
            data=serialized_data,
        ),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
