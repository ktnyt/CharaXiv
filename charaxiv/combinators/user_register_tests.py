import contextlib
from unittest import mock

import pytest

from charaxiv import combinators, protocols
from charaxiv.combinators.user_register import (Combinator,
                                                UserWithEmailExistsException)


@pytest.mark.asyncio
async def test_user_register() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.db_registration_exists = mock.AsyncMock(spec=protocols.db_registration_exists.Protocol, side_effect=[False])
    manager.db_registration_delete_by_email = mock.AsyncMock(spec=protocols.db_registration_delete_by_email.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[mock.sentinel.token])
    manager.db_registration_insert = mock.AsyncMock(spec=protocols.db_registration_insert.Protocol)
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_registration_exists=manager.db_registration_exists,
        db_registration_delete_by_email=manager.db_registration_delete_by_email,
        secret_token_generate=manager.secret_token_generate,
        db_registration_insert=manager.db_registration_insert,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    await combinator(email=mock.sentinel.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.db_registration_exists(email=mock.sentinel.email),
        mock.call.secret_token_generate(),
        mock.call.db_registration_insert(email=mock.sentinel.email, token=mock.sentinel.token),
        mock.call.user_registration_mail_send(email=mock.sentinel.email, token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_register__user_exists() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[True])
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_exists = mock.AsyncMock(spec=protocols.db_registration_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_delete_by_email = mock.AsyncMock(spec=protocols.db_registration_delete_by_email.Protocol, side_effect=Exception("should not be called"))
    manager.db_registration_insert = mock.AsyncMock(spec=protocols.db_registration_insert.Protocol, side_effect=Exception("should not be called"))
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        secret_token_generate=manager.secret_token_generate,
        db_registration_exists=manager.db_registration_exists,
        db_registration_delete_by_email=manager.db_registration_delete_by_email,
        db_registration_insert=manager.db_registration_insert,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    with pytest.raises(UserWithEmailExistsException):
        await combinator(email=mock.sentinel.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.context_manager.__aexit__(UserWithEmailExistsException, mock.ANY, mock.ANY),
    ]


@pytest.mark.asyncio
async def test_user_register__db_registration_exists() -> None:
    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock(spec=contextlib.AbstractAsyncContextManager[None])
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_with_email_exists = mock.AsyncMock(spec=protocols.db_user_with_email_exists.Protocol, side_effect=[False])
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[mock.sentinel.token])
    manager.db_registration_exists = mock.AsyncMock(spec=protocols.db_registration_exists.Protocol, side_effect=[True])
    manager.db_registration_delete_by_email = mock.AsyncMock(spec=protocols.db_registration_delete_by_email.Protocol)
    manager.db_registration_insert = mock.AsyncMock(spec=protocols.db_registration_insert.Protocol)
    manager.user_registration_mail_send = mock.AsyncMock(spec=combinators.user_registration_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_with_email_exists=manager.db_user_with_email_exists,
        db_registration_exists=manager.db_registration_exists,
        db_registration_delete_by_email=manager.db_registration_delete_by_email,
        secret_token_generate=manager.secret_token_generate,
        db_registration_insert=manager.db_registration_insert,
        user_registration_mail_send=manager.user_registration_mail_send,
    )

    # Execute combinator
    await combinator(email=mock.sentinel.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_with_email_exists(email=mock.sentinel.email),
        mock.call.db_registration_exists(email=mock.sentinel.email),
        mock.call.db_registration_delete_by_email(email=mock.sentinel.email),
        mock.call.secret_token_generate(),
        mock.call.db_registration_insert(email=mock.sentinel.email, token=mock.sentinel.token),
        mock.call.user_registration_mail_send(email=mock.sentinel.email, token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
