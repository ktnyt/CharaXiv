import contextlib
import secrets
from datetime import timedelta
from unittest import mock

import pytest
from argon2 import PasswordHasher

from charaxiv import lib, protocols, types
from charaxiv.combinators.user_activate import (
    Combinator, RegistrationExpiredException, RegistrationNotFoundException,
    UserWithUsernameExistsException)
from charaxiv.combinators.user_register import UserWithEmailExistsException


@pytest.mark.asyncio
async def test_user_activate(password_hasher: PasswordHasher) -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(minutes=5)

    registration = types.registration.Registration(email=email, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[False])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol)
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[hashedpw])
    manager.db_user_create = mock.AsyncMock(spec=protocols.db_user_create.Protocol)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        timezone_now=manager.timezone_now,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        password_hash=manager.password_hash,
        db_user_create=manager.db_user_create,
    )

    # Execute combinator
    await combinator(
        token=token,
        username=username,
        password=password,
    )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=token),
        mock.call.db_user_with_email_exists(email=email),
        mock.call.db_user_with_username_exists(username=username),
        mock.call.db_registration_delete_by_token(token=token),
        mock.call.timezone_now(),
        mock.call.password_hash(password=password),
        mock.call.db_user_create(
            email=email,
            username=username,
            password=hashedpw,
        ),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_activate__no_registration() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    username = "username"
    password = lib.password.generate()

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[None])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_create = mock.AsyncMock(spec=protocols.db_user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        timezone_now=manager.timezone_now,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        password_hash=manager.password_hash,
        db_user_create=manager.db_user_create,
    )

    # Execute combinator
    with pytest.raises(RegistrationNotFoundException):
        await combinator(
            token=token,
            username=username,
            password=password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=token),
        mock.call.context_manager.__aexit__(RegistrationNotFoundException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_user_with_email_exists() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(minutes=5)

    registration = types.registration.Registration(email=email, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[True])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_create = mock.AsyncMock(spec=protocols.db_user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        timezone_now=manager.timezone_now,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        password_hash=manager.password_hash,
        db_user_create=manager.db_user_create,
    )

    # Execute combinator
    with pytest.raises(UserWithEmailExistsException):
        await combinator(
            token=token,
            username=username,
            password=password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=token),
        mock.call.db_user_with_email_exists(email=email),
        mock.call.context_manager.__aexit__(UserWithEmailExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_user_with_username_exists() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(minutes=5)

    registration = types.registration.Registration(email=email, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[True])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_create = mock.AsyncMock(spec=protocols.db_user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        timezone_now=manager.timezone_now,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        password_hash=manager.password_hash,
        db_user_create=manager.db_user_create,
    )

    # Execute combinator
    with pytest.raises(UserWithUsernameExistsException):
        await combinator(
            token=token,
            username=username,
            password=password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=token),
        mock.call.db_user_with_email_exists(email=email),
        mock.call.db_user_with_username_exists(username=username),
        mock.call.context_manager.__aexit__(UserWithUsernameExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__db_registration_expired() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"
    username = "username"
    password = lib.password.generate()
    time_now = lib.timezone.now()
    created_at = time_now - timedelta(days=1, milliseconds=1)

    registration = types.registration.Registration(email=email, created_at=created_at)

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_registration_select_by_token = mock.AsyncMock(spec=protocols.db_registration_select_by_token.Protocol, side_effect=[registration])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_user_with_username_exists = mock.AsyncMock(spec=protocols.db_user_with_username_exists.Protocol, side_effect=[False])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.db_registration_delete_by_token = mock.AsyncMock(spec=protocols.db_registration_delete_by_token.Protocol)
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.db_user_create = mock.AsyncMock(spec=protocols.db_user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_registration_select_by_token=manager.db_registration_select_by_token,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_user_with_username_exists=manager.db_user_with_username_exists,
        timezone_now=manager.timezone_now,
        db_registration_delete_by_token=manager.db_registration_delete_by_token,
        password_hash=manager.password_hash,
        db_user_create=manager.db_user_create,
    )

    # Execute combinator
    with pytest.raises(RegistrationExpiredException):
        await combinator(
            token=token,
            username=username,
            password=password,
        )

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_registration_select_by_token(token=token),
        mock.call.db_user_with_email_exists(email=email),
        mock.call.db_user_with_username_exists(username=username),
        mock.call.db_registration_delete_by_token(token=token),
        mock.call.timezone_now(),
        mock.call.context_manager.__aexit__(RegistrationExpiredException, mock.ANY, mock.ANY),
    ]
