import contextlib
import secrets
from unittest import mock

import pytest

from charaxiv import combinators, protocols
from charaxiv.combinators.user_register import (Combinator,
                                                UserWithEmailExistsException)


@pytest.mark.asyncio
async def test_user_register() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[False])
    manager.registration_exists = mock.AsyncMock(spec=protocols.registration_exists.Protocol, side_effect=[False])
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[token])
    manager.registration_create = mock.AsyncMock(spec=protocols.registration_create.Protocol)
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        user_with_email_exists=manager.user_with_email_exists,
        registration_exists=manager.registration_exists,
        registration_delete=manager.registration_delete,
        secret_token_generate=manager.secret_token_generate,
        registration_create=manager.registration_create,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    await combinator(email=email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.user_with_email_exists(email=email),
        mock.call.registration_exists(email=email),
        mock.call.secret_token_generate(),
        mock.call.registration_create(email=email, token=token),
        mock.call.user_registration_mail_send(email=email, token=token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_register__user_exists() -> None:
    # Setup data
    email = "test@example.com"

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[True])
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=Exception("should not be called"))
    manager.registration_exists = mock.AsyncMock(spec=protocols.registration_exists.Protocol, side_effect=Exception("should not be called"))
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol, side_effect=Exception("should not be called"))
    manager.registration_create = mock.AsyncMock(spec=protocols.registration_create.Protocol, side_effect=Exception("should not be called"))
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        user_with_email_exists=manager.user_with_email_exists,
        secret_token_generate=manager.secret_token_generate,
        registration_exists=manager.registration_exists,
        registration_delete=manager.registration_delete,
        registration_create=manager.registration_create,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    with pytest.raises(UserWithEmailExistsException):
        await combinator(email=email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.user_with_email_exists(email=email),
        mock.call.context_manager.__aexit__(UserWithEmailExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_register__registration_exists() -> None:
    # Setup data
    token = secrets.token_urlsafe(32)
    email = "test@example.com"

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.user_with_email_exists = mock.AsyncMock(spec=protocols.user_with_email_exists.Protocol, side_effect=[False])
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[token])
    manager.registration_exists = mock.AsyncMock(spec=protocols.registration_exists.Protocol, side_effect=[True])
    manager.registration_delete = mock.AsyncMock(spec=protocols.registration_delete.Protocol)
    manager.registration_create = mock.AsyncMock(spec=protocols.registration_create.Protocol)
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        user_with_email_exists=manager.user_with_email_exists,
        registration_exists=manager.registration_exists,
        registration_delete=manager.registration_delete,
        secret_token_generate=manager.secret_token_generate,
        registration_create=manager.registration_create,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    await combinator(email=email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.user_with_email_exists(email=email),
        mock.call.registration_exists(email=email),
        mock.call.registration_delete(email=email),
        mock.call.secret_token_generate(),
        mock.call.registration_create(email=email, token=token),
        mock.call.user_registration_mail_send(email=email, token=token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
