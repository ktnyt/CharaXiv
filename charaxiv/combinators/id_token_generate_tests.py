from unittest import mock

from uuid6 import uuid7

from charaxiv import protocols
from charaxiv.combinators.id_token_generate import Combinator


def test_combinator() -> None:
    # Setup data
    uuid = uuid7()

    # Setup mocks
    manager = mock.Mock()
    manager.uuid_generate = mock.Mock(spec=protocols.id_token_generate.Protocol, side_effect=[uuid])

    # Instantiate combinator
    combinator = Combinator(manager.uuid_generate)

    # Execute combinator
    output = combinator()

    # Assert output (if available)
    assert output.to_uuid() == uuid

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.uuid_generate(),
    ]
