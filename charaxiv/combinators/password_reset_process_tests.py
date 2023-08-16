import contextlib
from datetime import timedelta
from unittest import mock

import pytest

from charaxiv import protocols, types
from charaxiv.combinators.password_reset_process import (
    Combinator, PasswordResetRequestExpiredException,
    PasswordResetRequestNotFoundException,
    UserPasswordUpdateWithIdFailedException)


@pytest.mark.asyncio
async def test_password_reset_process() -> None:
    # Setup data
    password_reset_request = types.password_reset.PasswordResetRequest.model_construct(
        user_id=mock.sentinel.user_id,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_password_reset_request_select_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_select_by_token.Protocol, side_effect=[password_reset_request])
    manager.db_password_reset_request_delete_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_token.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[mock.sentinel.current_time])
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt, side_effect=[False])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[mock.sentinel.hashedpw])
    manager.db_user_password_update_by_id = mock.AsyncMock(spec=protocols.db_user_password_update_by_id.Protocol, side_effect=[True])

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_password_reset_request_select_by_token=manager.db_password_reset_request_select_by_token,
        db_password_reset_request_delete_by_token=manager.db_password_reset_request_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_password_update_by_id=manager.db_user_password_update_by_id,
    )

    # Execute combinator
    await combinator(token=mock.sentinel.token, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_password_reset_request_select_by_token(token=mock.sentinel.token),
        mock.call.db_password_reset_request_delete_by_token(token=mock.sentinel.token),
        mock.call.timezone_now(),
        mock.call.datetime_diff_gt(mock.sentinel.created_at, mock.sentinel.current_time, timedelta(days=1)),
        mock.call.password_hash(password=mock.sentinel.password),
        mock.call.db_user_password_update_by_id(user_id=password_reset_request.user_id, password=mock.sentinel.hashedpw),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_password_reset_process__db_password_reset_request_not_found() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_password_reset_request_select_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_select_by_token.Protocol, side_effect=[None])
    manager.db_password_reset_request_delete_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_password_update_by_id = mock.AsyncMock(spec=protocols.db_user_password_update_by_id.Protocol, side_effect=Exception("should not be called"))

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_password_reset_request_select_by_token=manager.db_password_reset_request_select_by_token,
        db_password_reset_request_delete_by_token=manager.db_password_reset_request_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_password_update_by_id=manager.db_user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(PasswordResetRequestNotFoundException):
        await combinator(token=mock.sentinel.token, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_password_reset_request_select_by_token(token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(PasswordResetRequestNotFoundException, mock.ANY, mock.ANY),
    ]


@ pytest.mark.asyncio
async def test_password_reset_process__db_password_reset_request_expired() -> None:
    # Setup data
    password_reset_request = types.password_reset.PasswordResetRequest.model_construct(
        user_id=mock.sentinel.user_id,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_password_reset_request_select_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_select_by_token.Protocol, side_effect=[password_reset_request])
    manager.db_password_reset_request_delete_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_token.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[mock.sentinel.current_time])
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt, side_effect=[True])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_password_update_by_id = mock.AsyncMock(spec=protocols.db_user_password_update_by_id.Protocol, side_effect=Exception("should not be called"))

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_password_reset_request_select_by_token=manager.db_password_reset_request_select_by_token,
        db_password_reset_request_delete_by_token=manager.db_password_reset_request_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_password_update_by_id=manager.db_user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(PasswordResetRequestExpiredException):
        await combinator(token=mock.sentinel.token, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_password_reset_request_select_by_token(token=mock.sentinel.token),
        mock.call.db_password_reset_request_delete_by_token(token=mock.sentinel.token),
        mock.call.timezone_now(),
        mock.call.datetime_diff_gt(mock.sentinel.created_at, mock.sentinel.current_time, timedelta(days=1)),
        mock.call.context_manager.__aexit__(PasswordResetRequestExpiredException, mock.ANY, mock.ANY),
    ]


@ pytest.mark.asyncio
async def test_password_reset_process__db_user_password_update_with_id_failed() -> None:
    # Setup data
    password_reset_request = types.password_reset.PasswordResetRequest.model_construct(
        user_id=mock.sentinel.user_id,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_password_reset_request_select_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_select_by_token.Protocol, side_effect=[password_reset_request])
    manager.db_password_reset_request_delete_by_token = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_token.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[mock.sentinel.current_time])
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt, side_effect=[False])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[mock.sentinel.hashedpw])
    manager.db_user_password_update_by_id = mock.AsyncMock(spec=protocols.db_user_password_update_by_id.Protocol, side_effect=[False])

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_password_reset_request_select_by_token=manager.db_password_reset_request_select_by_token,
        db_password_reset_request_delete_by_token=manager.db_password_reset_request_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_password_update_by_id=manager.db_user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(UserPasswordUpdateWithIdFailedException):
        await combinator(token=mock.sentinel.token, password=mock.sentinel.password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_password_reset_request_select_by_token(token=mock.sentinel.token),
        mock.call.db_password_reset_request_delete_by_token(token=mock.sentinel.token),
        mock.call.timezone_now(),
        mock.call.datetime_diff_gt(mock.sentinel.created_at, mock.sentinel.current_time, timedelta(days=1)),
        mock.call.password_hash(password=mock.sentinel.password),
        mock.call.db_user_password_update_by_id(user_id=password_reset_request.user_id, password=mock.sentinel.hashedpw),
        mock.call.context_manager.__aexit__(UserPasswordUpdateWithIdFailedException, mock.ANY, mock.ANY),
    ]
