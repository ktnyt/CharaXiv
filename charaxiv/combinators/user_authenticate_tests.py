from unittest import mock

import pytest

from charaxiv import protocols, types
from charaxiv.combinators.user_authenticate import (
    Combinator, UserWithIDNotFoundException)


@pytest.mark.asyncio
async def test_user_authenticate() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.user_id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.password,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.db_user_select_by_id = mock.AsyncMock(spec=protocols.db_user_select_by_id.Protocol, side_effect=[user])

    # Instantiate combinator
    combinator = Combinator(db_user_select_by_id=manager.db_user_select_by_id)

    # Execute combinator
    output = await combinator(mock.sentinel.user_id)

    # Assert output (if available)
    assert output == user

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.db_user_select_by_id(id=mock.sentinel.user_id),
    ]


@pytest.mark.asyncio
async def test_user_authenticate__user_not_found() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.db_user_select_by_id = mock.AsyncMock(spec=protocols.db_user_select_by_id.Protocol, side_effect=[None])

    # Instantiate combinator
    combinator = Combinator(db_user_select_by_id=manager.db_user_select_by_id)

    # Execute combinator
    with pytest.raises(UserWithIDNotFoundException):
        await combinator(mock.sentinel.user_id)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.db_user_select_by_id(id=mock.sentinel.user_id),
    ]
