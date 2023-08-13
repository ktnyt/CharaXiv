import contextlib
from unittest import mock

import pytest

from charaxiv import protocols, types
from charaxiv.combinators.user_login import (Combinator,
                                             UserVerificationException)


@pytest.mark.asyncio
async def test_user_login() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.user_id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.hashedpw,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=[True])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    output = await combinator(email=mock.sentinel.email, password=mock.sentinel.password)

    # Assert output (if available)
    assert output == mock.sentinel.user_id

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=mock.sentinel.email),
        mock.call.password_verify(hash=mock.sentinel.hashedpw, password=mock.sentinel.password),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_login__db_user_with_email_not_found() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[None])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    with pytest.raises(UserVerificationException):
        await combinator(email=mock.sentinel.email, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=mock.sentinel.email),
        mock.call.context_manager.__aexit__(UserVerificationException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_login__password_verify_failed() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.user_id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.hashedpw,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.password_verify = mock.Mock(spec=protocols.password_verify.Protocol, side_effect=[False])

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        password_verify=manager.password_verify,
    )

    # Execute combinator
    with pytest.raises(UserVerificationException):
        await combinator(email=mock.sentinel.email, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=mock.sentinel.email),
        mock.call.password_verify(hash=mock.sentinel.hashedpw, password=mock.sentinel.password),
        mock.call.context_manager.__aexit__(UserVerificationException, mock.ANY, mock.ANY),
    ]
