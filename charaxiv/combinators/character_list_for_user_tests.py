from unittest import mock

import pytest

from charaxiv import protocols
from charaxiv.combinators.character_list_for_user import Combinator


@pytest.mark.asyncio
async def test_character_list_for_user() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.db_character_filter_by_owner = mock.AsyncMock(spec=protocols.db_character_filter_by_owner.Protocol, side_effect=[mock.sentinel.character_summaries])

    # Instantiate combinator
    combinator = Combinator(
        db_character_filter_by_owner=manager.db_character_filter_by_owner,
    )

    # Execute combinator
    output = await combinator(
        user_id=mock.sentinel.user_id,
        until_character_id=mock.sentinel.until_character_id,
        limit=mock.sentinel.limit,
    )

    # Assert output (if available)
    assert output == mock.sentinel.character_summaries

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.db_character_filter_by_owner(
            owner_id=mock.sentinel.user_id,
            until_character_id=mock.sentinel.until_character_id,
            limit=mock.sentinel.limit,
        ),
    ]
