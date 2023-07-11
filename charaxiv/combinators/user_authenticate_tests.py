from unittest import mock

import pytest
from argon2 import PasswordHasher
from uuid6 import uuid7

from charaxiv import lib, protocols, types
from charaxiv.combinators.user_authenticate import (
    Combinator, UserWithIDNotFoundException)


@pytest.mark.asyncio
async def test_user_authenticate(password_hasher: PasswordHasher) -> None:
    # Setup data
    userid = uuid7()
    email = "test@example.com"
    username = "username"
    password = password_hasher.hash(lib.password.generate())
    group = types.user.Group.ADMIN

    user = types.user.User(
        id=userid,
        email=email,
        username=username,
        password=password,
        group=group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.user_get_by_id = mock.AsyncMock(spec=protocols.user_get_by_id.Protocol, side_effect=[user])

    # Instantiate combinator
    combinator = Combinator(user_get_by_id=manager.user_get_by_id)

    # Execute combinator
    output = await combinator(userid)

    # Assert output (if available)
    assert output == user

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.user_get_by_id(id=userid),
    ]


@pytest.mark.asyncio
async def test_user_authenticate__user_not_found() -> None:
    # Setup data
    userid = uuid7()

    # Setup mocks
    manager = mock.Mock()
    manager.user_get_by_id = mock.AsyncMock(spec=protocols.user_get_by_id.Protocol, side_effect=[None])

    # Instantiate combinator
    combinator = Combinator(user_get_by_id=manager.user_get_by_id)

    # Execute combinator
    with pytest.raises(UserWithIDNotFoundException):
        await combinator(userid)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.user_get_by_id(id=userid),
    ]
