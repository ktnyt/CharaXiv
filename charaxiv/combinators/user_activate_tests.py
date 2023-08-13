import contextlib
from datetime import timedelta
from unittest import mock

import pytest

from charaxiv import protocols, types
from charaxiv.combinators.user_activate import (
    Combinator, RegistrationExpiredException, RegistrationNotFoundException,
    UserWithUsernameExistsException)
from charaxiv.combinators.user_register import UserWithEmailExistsException


@pytest.mark.asyncio
async def test_user_activate() -> None:
    # Setup data
    registration = types.registration.Registration.model_construct(
        email=mock.sentinel.email,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[False])
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[mock.sentinel.current_time])
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt.Protocol, side_effect=[False])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[mock.sentinel.hashedpw])
    manager.db_user_insert = mock.AsyncMock(spec=protocols.db_user_insert.Protocol)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_insert=manager.db_user_insert,
    )

    # Execute combinator
    await combinator(
        token=mock.sentinel.token,
        username=mock.sentinel.username,
        password=mock.sentinel.password,
    )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=mock.sentinel.token),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.db_user_with_username_exists(username=mock.sentinel.username),
        mock.call.db_registration_delete_by_token(token=mock.sentinel.token),
        mock.call.timezone_now(),
        mock.call.datetime_diff_gt(mock.sentinel.created_at, mock.sentinel.current_time, timedelta(days=1)),
        mock.call.password_hash(password=mock.sentinel.password),
        mock.call.db_user_insert(
            email=mock.sentinel.email,
            username=mock.sentinel.username,
            password=mock.sentinel.hashedpw,
            group=types.user.Group.BASE,
        ),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_activate__no_registration() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[None])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_insert = mock.AsyncMock(spec=protocols.db_user_insert.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_insert=manager.db_user_insert,
    )

    # Execute combinator
    with pytest.raises(RegistrationNotFoundException):
        await combinator(
            token=mock.sentinel.token,
            username=mock.sentinel.username,
            password=mock.sentinel.password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(RegistrationNotFoundException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_user_with_email_exists() -> None:
    # Setup data
    registration = types.registration.Registration.model_construct(
        email=mock.sentinel.email,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[True])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_insert = mock.AsyncMock(spec=protocols.db_user_insert.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_insert=manager.db_user_insert,
    )

    # Execute combinator
    with pytest.raises(UserWithEmailExistsException):
        await combinator(
            token=mock.sentinel.token,
            username=mock.sentinel.username,
            password=mock.sentinel.password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=mock.sentinel.token),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.context_manager.__aexit__(UserWithEmailExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_user_with_username_exists() -> None:
    # Setup data
    registration = types.registration.Registration.model_construct(
        email=mock.sentinel.email,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[True])
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_insert = mock.AsyncMock(spec=protocols.db_user_insert.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_insert=manager.db_user_insert,
    )

    # Execute combinator
    with pytest.raises(UserWithUsernameExistsException):
        await combinator(
            token=mock.sentinel.token,
            username=mock.sentinel.username,
            password=mock.sentinel.password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=mock.sentinel.token),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.db_user_with_username_exists(username=mock.sentinel.username),
        mock.call.context_manager.__aexit__(UserWithUsernameExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_registration_expired() -> None:
    # Setup data
    registration = types.registration.Registration.model_construct(
        email=mock.sentinel.email,
        created_at=mock.sentinel.created_at,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[False])
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol)
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[mock.sentinel.current_time])
    manager.datetime_diff_gt = mock.Mock(spec=protocols.datetime_diff_gt.Protocol, side_effect=[True])
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_insert = mock.AsyncMock(spec=protocols.db_user_insert.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        timezone_now=manager.timezone_now,
        datetime_diff_gt=manager.datetime_diff_gt,
        password_hash=manager.password_hash,
        db_user_insert=manager.db_user_insert,
    )

    # Execute combinator
    with pytest.raises(RegistrationExpiredException):
        await combinator(
            token=mock.sentinel.token,
            username=mock.sentinel.username,
            password=mock.sentinel.password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=mock.sentinel.token),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.db_user_with_username_exists(username=mock.sentinel.username),
        mock.call.db_registration_delete_by_token(token=mock.sentinel.token),
        mock.call.timezone_now(),
        mock.call.datetime_diff_gt(mock.sentinel.created_at, mock.sentinel.current_time, timedelta(days=1)),
        mock.call.context_manager.__aexit__(RegistrationExpiredException, mock.ANY, mock.ANY),
    ]
