import contextlib
import secrets
from datetime import timedelta
from unittest import mock

import pytest
from argon2 import PasswordHasher
from uuid6 import uuid7

from charaxiv import lib, protocols, types
from charaxiv.combinators.user_password_reset import (
    Combinator, PasswordResetRequestExpiredException,
    PasswordResetRequestNotFoundException,
    UserPasswordUpdateWithIdFailedException)


@pytest.mark.asyncio
async def test_user_password_reset(password_hasher: PasswordHasher) -> None:
    # Setup data
    userid = uuid7()
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(minutes=5)

    password_reset_request = types.password_reset.PasswordResetRequest(userid=userid, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.password_reset_request_get_by_token = mock.AsyncMock(spec=protocols.password_reset_request_get_by_token.Protocol, side_effect=[password_reset_request])
    manager.password_reset_request_delete = mock.AsyncMock(spec=protocols.password_reset_request_delete.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[hashedpw])
    manager.user_password_update_by_id = mock.AsyncMock(spec=protocols.user_password_update_by_id.Protocol, side_effect=[True])

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        password_reset_request_get_by_token=manager.password_reset_request_get_by_token,
        password_reset_request_delete=manager.password_reset_request_delete,
        timezone_now=manager.timezone_now,
        password_hash=manager.password_hash,
        user_password_update_by_id=manager.user_password_update_by_id,
    )

    # Execute combinator
    await combinator(token=token, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.password_reset_request_get_by_token(token=token),
        mock.call.password_reset_request_delete(token=token),
        mock.call.timezone_now(),
        mock.call.password_hash(password=password),
        mock.call.user_password_update_by_id(userid=userid, password=hashedpw),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_password_reset__password_reset_request_not_found(password_hasher: PasswordHasher) -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    time_now = lib.timezone.now()

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.password_reset_request_get_by_token = mock.AsyncMock(spec=protocols.password_reset_request_get_by_token.Protocol, side_effect=[None])
    manager.password_reset_request_delete = mock.AsyncMock(spec=protocols.password_reset_request_delete.Protocol)
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[hashedpw])
    manager.user_password_update_by_id = mock.AsyncMock(spec=protocols.user_password_update_by_id.Protocol, side_effect=Exception("should not be called"))

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        password_reset_request_get_by_token=manager.password_reset_request_get_by_token,
        password_reset_request_delete=manager.password_reset_request_delete,
        timezone_now=manager.timezone_now,
        password_hash=manager.password_hash,
        user_password_update_by_id=manager.user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(PasswordResetRequestNotFoundException):
        await combinator(token=token, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.password_reset_request_get_by_token(token=token),
        mock.call.context_manager.__aexit__(PasswordResetRequestNotFoundException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_password_reset__password_reset_request_expired() -> None:
    # Setup data
    userid = uuid7()
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(days=1, microseconds=1)

    password_reset_request = types.password_reset.PasswordResetRequest(userid=userid, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.password_reset_request_get_by_token = mock.AsyncMock(spec=protocols.password_reset_request_get_by_token.Protocol, side_effect=[password_reset_request])
    manager.password_reset_request_delete = mock.AsyncMock(spec=protocols.password_reset_request_delete.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.user_password_update_by_id = mock.AsyncMock(spec=protocols.user_password_update_by_id.Protocol, side_effect=Exception("should not be called"))

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        password_reset_request_get_by_token=manager.password_reset_request_get_by_token,
        password_reset_request_delete=manager.password_reset_request_delete,
        timezone_now=manager.timezone_now,
        password_hash=manager.password_hash,
        user_password_update_by_id=manager.user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(PasswordResetRequestExpiredException):
        await combinator(token=token, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.password_reset_request_get_by_token(token=token),
        mock.call.password_reset_request_delete(token=token),
        mock.call.timezone_now(),
        mock.call.context_manager.__aexit__(PasswordResetRequestExpiredException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_password_reset__user_password_update_with_id_failed(password_hasher: PasswordHasher) -> None:
    # Setup data
    userid = uuid7()
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(minutes=5)

    password_reset_request = types.password_reset.PasswordResetRequest(userid=userid, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.password_reset_request_get_by_token = mock.AsyncMock(spec=protocols.password_reset_request_get_by_token.Protocol, side_effect=[password_reset_request])
    manager.password_reset_request_delete = mock.AsyncMock(spec=protocols.password_reset_request_delete.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[hashedpw])
    manager.user_password_update_by_id = mock.AsyncMock(spec=protocols.user_password_update_by_id.Protocol, side_effect=[False])

    # Setup dependencies
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        password_reset_request_get_by_token=manager.password_reset_request_get_by_token,
        password_reset_request_delete=manager.password_reset_request_delete,
        timezone_now=manager.timezone_now,
        password_hash=manager.password_hash,
        user_password_update_by_id=manager.user_password_update_by_id,
    )

    # Execute combinator
    with pytest.raises(UserPasswordUpdateWithIdFailedException):
        await combinator(token=token, password=password)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.password_reset_request_get_by_token(token=token),
        mock.call.password_reset_request_delete(token=token),
        mock.call.timezone_now(),
        mock.call.password_hash(password=password),
        mock.call.user_password_update_by_id(userid=userid, password=hashedpw),
        mock.call.context_manager.__aexit__(UserPasswordUpdateWithIdFailedException, mock.ANY, mock.ANY),
    ]
