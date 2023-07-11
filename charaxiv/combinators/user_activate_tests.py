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
    manager.registration_get_by_token = mock.AsyncMock(spec=protocols.registration_get_by_token.Protocol, side_effect=[registration])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[False])
    manager.user_with_username_exists = mock.AsyncMock(spec=protocols.user_with_username_exists.Protocol, side_effect=[False])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol)
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=[hashedpw])
    manager.user_create = mock.AsyncMock(spec=protocols.user_create.Protocol)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        registration_get_by_token=manager.registration_get_by_token,
        user_with_email_exists=manager.user_with_email_exists,
        user_with_username_exists=manager.user_with_username_exists,
        timezone_now=manager.timezone_now,
        registration_delete=manager.registration_delete,
        password_hash=manager.password_hash,
        user_create=manager.user_create,
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
        mock.call.registration_get_by_token(token=token),
        mock.call.user_with_email_exists(email=email),
        mock.call.user_with_username_exists(username=username),
        mock.call.registration_delete(token=token),
        mock.call.timezone_now(),
        mock.call.password_hash(password=password),
        mock.call.user_create(
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
    manager.registration_get_by_token = mock.AsyncMock(spec=protocols.registration_get_by_token.Protocol, side_effect=[None])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=Exception("should not be called"))
    manager.user_with_username_exists = mock.AsyncMock(spec=protocols.user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.user_create = mock.AsyncMock(spec=protocols.user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        registration_get_by_token=manager.registration_get_by_token,
        user_with_email_exists=manager.user_with_email_exists,
        user_with_username_exists=manager.user_with_username_exists,
        timezone_now=manager.timezone_now,
        registration_delete=manager.registration_delete,
        password_hash=manager.password_hash,
        user_create=manager.user_create,
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
        mock.call.registration_get_by_token(token=token),
        mock.call.context_manager.__aexit__(RegistrationNotFoundException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__user_with_email_exists() -> None:
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
    manager.registration_get_by_token = mock.AsyncMock(spec=protocols.registration_get_by_token.Protocol, side_effect=[registration])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[True])
    manager.user_with_username_exists = mock.AsyncMock(spec=protocols.user_with_username_exists.Protocol, side_effect=Exception("should not be called"))
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.user_create = mock.AsyncMock(spec=protocols.user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        registration_get_by_token=manager.registration_get_by_token,
        user_with_email_exists=manager.user_with_email_exists,
        user_with_username_exists=manager.user_with_username_exists,
        timezone_now=manager.timezone_now,
        registration_delete=manager.registration_delete,
        password_hash=manager.password_hash,
        user_create=manager.user_create,
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
        mock.call.registration_get_by_token(token=token),
        mock.call.user_with_email_exists(email=email),
        mock.call.context_manager.__aexit__(UserWithEmailExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__user_with_username_exists() -> None:
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
    manager.registration_get_by_token = mock.AsyncMock(spec=protocols.registration_get_by_token.Protocol, side_effect=[registration])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[False])
    manager.user_with_username_exists = mock.AsyncMock(spec=protocols.user_with_username_exists.Protocol, side_effect=[True])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=Exception("should not be called"))
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol, side_effect=Exception("should not be called"))
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.user_create = mock.AsyncMock(spec=protocols.user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        registration_get_by_token=manager.registration_get_by_token,
        user_with_email_exists=manager.user_with_email_exists,
        user_with_username_exists=manager.user_with_username_exists,
        timezone_now=manager.timezone_now,
        registration_delete=manager.registration_delete,
        password_hash=manager.password_hash,
        user_create=manager.user_create,
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
        mock.call.registration_get_by_token(token=token),
        mock.call.user_with_email_exists(email=email),
        mock.call.user_with_username_exists(username=username),
        mock.call.context_manager.__aexit__(UserWithUsernameExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_activate__registration_expired() -> None:
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
    manager.registration_get_by_token = mock.AsyncMock(spec=protocols.registration_get_by_token.Protocol, side_effect=[registration])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[False])
    manager.user_with_username_exists = mock.AsyncMock(spec=protocols.user_with_username_exists.Protocol, side_effect=[False])
    manager.timezone_now = mock.Mock(spec=protocols.timezone_now.Protocol, side_effect=[time_now])
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol)
    manager.password_hash = mock.Mock(spec=protocols.password_hash.Protocol, side_effect=Exception("should not be called"))
    manager.user_create = mock.AsyncMock(spec=protocols.user_create.Protocol, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        registration_get_by_token=manager.registration_get_by_token,
        user_with_email_exists=manager.user_with_email_exists,
        user_with_username_exists=manager.user_with_username_exists,
        timezone_now=manager.timezone_now,
        registration_delete=manager.registration_delete,
        password_hash=manager.password_hash,
        user_create=manager.user_create,
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
        mock.call.registration_get_by_token(token=token),
        mock.call.user_with_email_exists(email=email),
        mock.call.user_with_username_exists(username=username),
        mock.call.registration_delete(token=token),
        mock.call.timezone_now(),
        mock.call.context_manager.__aexit__(RegistrationExpiredException, mock.ANY, mock.ANY),
    ]
