import contextlib
from unittest import mock

import pytest
from argon2 import PasswordHasher
from uuid6 import uuid7

from charaxiv import lib, protocols, types
from charaxiv.combinators.user_login import (Combinator,
                                             UserVerificationException)


@pytest.mark.asyncio
async def test_user_login(password_hasher: PasswordHasher) -> None:
    # Setup data
    user_id = uuid7()
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    group = types.user.Group.ADMIN
    user = types.user.User(
        id=user_id,
        email=email,
        username=username,
        password=hashedpw,
        group=group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=[True])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    output = await combinator(email=email, password=password)

    # Assert output (if available)
    assert output == user_id

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=email),
        mock.call.password_verify(hash=hashedpw, password=password),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_login__db_user_with_email_not_found() -> None:
    # Setup data
    email = "test@example.com"
    password = lib.password.generate()

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[None])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    with pytest.raises(UserVerificationException):
        await combinator(email=email, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=email),
        mock.call.context_manager.__aexit__(UserVerificationException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_login__password_verify_failed(password_hasher: PasswordHasher) -> None:
    # Setup data
    user_id = uuid7()
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    group = types.user.Group.ADMIN
    user = types.user.User(
        id=user_id,
        email=email,
        username=username,
        password=hashedpw,
        group=group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=[False])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    with pytest.raises(UserVerificationException):
        await combinator(email=email, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=email),
        mock.call.password_verify(hash=hashedpw, password=password),
        mock.call.context_manager.__aexit__(UserVerificationException, mock.ANY, mock.ANY),
    ]
