import secrets
from unittest import mock

import pytest
from argon2 import PasswordHasher
from uuid6 import uuid7

from charaxiv import combinators, lib, protocols, types
from charaxiv.combinators.user_password_reset_request import (
    Combinator, UserWithEmailNotFoundException)


@pytest.mark.asyncio
async def test_user_password_reset_request(password_hasher: PasswordHasher) -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    user = types.user.User(
        id=uuid7(),
        email="test@example.com",
        username="username",
        password=hashedpw,
        group=types.user.Group.ADMIN,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.user_password_reset_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=[False])
    manager.user_password_reset_delete = mock.AsyncMock(spec=protocols.db_password_reset_request_delete.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[token])
    manager.user_password_reset_create = mock.AsyncMock(spec=protocols.db_password_reset_request_create.Protocol)
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        user_password_reset_exists=manager.user_password_reset_exists,
        user_password_reset_delete=manager.user_password_reset_delete,
        secret_token_generate=manager.secret_token_generate,
        user_password_reset_create=manager.user_password_reset_create,
        user_password_reset_mail_send=manager.user_password_reset_mail_send,
    )

    # Execute combinator
    await combinator(email=user.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=user.email),
        mock.call.user_password_reset_exists(user_id=user.id),
        mock.call.secret_token_generate(),
        mock.call.user_password_reset_create(user_id=user.id, token=token),
        mock.call.user_password_reset_mail_send(email=user.email, token=token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_db_password_reset_request__db_user_with_email_not_found(password_hasher: PasswordHasher) -> None:
    # Setup data
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    user = types.user.User(
        id=uuid7(),
        email="test@example.com",
        username="username",
        password=hashedpw,
        group=types.user.Group.ADMIN,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[None])
    manager.user_password_reset_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=Exception("should not be called"))
    manager.user_password_reset_delete = mock.AsyncMock(spec=protocols.db_password_reset_request_delete.Protocol, side_effect=Exception("should not be called"))
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=Exception("should not be called"))
    manager.user_password_reset_create = mock.AsyncMock(spec=protocols.db_password_reset_request_create.Protocol, side_effect=Exception("should not be called"))
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        user_password_reset_exists=manager.user_password_reset_exists,
        user_password_reset_delete=manager.user_password_reset_delete,
        secret_token_generate=manager.secret_token_generate,
        user_password_reset_create=manager.user_password_reset_create,
        user_password_reset_mail_send=manager.user_password_reset_mail_send,
    )

    # Execute combinator
    with pytest.raises(UserWithEmailNotFoundException):
        await combinator(email=user.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=user.email),
        mock.call.context_manager.__aexit__(UserWithEmailNotFoundException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_db_password_reset_request__password_reset_request_exists(password_hasher: PasswordHasher) -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()
    hashedpw = password_hasher.hash(password)
    user = types.user.User(
        id=uuid7(),
        email="test@example.com",
        username="username",
        password=hashedpw,
        group=types.user.Group.ADMIN,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_get_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.user_password_reset_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=[True])
    manager.user_password_reset_delete = mock.AsyncMock(spec=protocols.db_password_reset_request_delete.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[token])
    manager.user_password_reset_create = mock.AsyncMock(spec=protocols.db_password_reset_request_create.Protocol)
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_get_by_email=manager.db_user_select_by_email,
        user_password_reset_exists=manager.user_password_reset_exists,
        user_password_reset_delete=manager.user_password_reset_delete,
        secret_token_generate=manager.secret_token_generate,
        user_password_reset_create=manager.user_password_reset_create,
        user_password_reset_mail_send=manager.user_password_reset_mail_send,
    )

    # Execute combinator
    await combinator(email=user.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=user.email),
        mock.call.user_password_reset_exists(user_id=user.id),
        mock.call.user_password_reset_delete(user_id=user.id),
        mock.call.secret_token_generate(),
        mock.call.user_password_reset_create(user_id=user.id, token=token),
        mock.call.user_password_reset_mail_send(email=user.email, token=token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
