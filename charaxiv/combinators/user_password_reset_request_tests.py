from unittest import mock

import pytest

from charaxiv import combinators, protocols, types
from charaxiv.combinators.user_password_reset_request import (
    Combinator, UserWithEmailNotFoundException)


@pytest.mark.asyncio
async def test_db_password_reset_request_request() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.password,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.db_password_reset_request_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=[False])
    manager.db_password_reset_request_delete_by_user_id = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_user_id.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[mock.sentinel.token])
    manager.db_password_reset_request_create = mock.AsyncMock(spec=protocols.db_password_reset_request_insert.Protocol)
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        db_password_reset_request_exists=manager.db_password_reset_request_exists,
        db_password_reset_request_delete_by_user_id=manager.db_password_reset_request_delete_by_user_id,
        secret_token_generate=manager.secret_token_generate,
        db_password_reset_request_create=manager.db_password_reset_request_create,
        user_password_reset_mail_send=manager.user_password_reset_mail_send,
    )

    # Execute combinator
    await combinator(email=user.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=user.email),
        mock.call.db_password_reset_request_exists(user_id=user.id),
        mock.call.secret_token_generate(),
        mock.call.db_password_reset_request_create(user_id=user.id, token=mock.sentinel.token),
        mock.call.user_password_reset_mail_send(email=user.email, token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]


@pytest.mark.asyncio
async def test_user_db_password_reset_request__db_user_with_email_not_found() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.password,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[None])
    manager.db_password_reset_request_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=Exception("should not be called"))
    manager.db_password_reset_request_delete_by_user_id = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_user_id.Protocol, side_effect=Exception("should not be called"))
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=Exception("should not be called"))
    manager.db_password_reset_request_create = mock.AsyncMock(spec=protocols.db_password_reset_request_insert.Protocol, side_effect=Exception("should not be called"))
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator, side_effect=Exception("should not be called"))

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        db_password_reset_request_exists=manager.db_password_reset_request_exists,
        db_password_reset_request_delete_by_user_id=manager.db_password_reset_request_delete_by_user_id,
        secret_token_generate=manager.secret_token_generate,
        db_password_reset_request_create=manager.db_password_reset_request_create,
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
async def test_user_db_password_reset_request__password_reset_request_exists() -> None:
    # Setup data
    user = types.user.User.model_construct(
        id=mock.sentinel.id,
        email=mock.sentinel.email,
        username=mock.sentinel.username,
        password=mock.sentinel.password,
        group=mock.sentinel.group,
    )

    # Setup mocks
    manager = mock.Mock()
    manager.context_manager = mock.AsyncMock()
    manager.transaction_atomic = mock.Mock(spec=protocols.transaction_atomic.Protocol, side_effect=[manager.context_manager])
    manager.db_user_select_by_email = mock.AsyncMock(spec=protocols.db_user_select_by_email.Protocol, side_effect=[user])
    manager.db_password_reset_request_exists = mock.AsyncMock(spec=protocols.db_password_reset_request_exists.Protocol, side_effect=[True])
    manager.db_password_reset_request_delete_by_user_id = mock.AsyncMock(spec=protocols.db_password_reset_request_delete_by_user_id.Protocol)
    manager.secret_token_generate = mock.Mock(spec=protocols.secret_token_generate.Protocol, side_effect=[mock.sentinel.token])
    manager.db_password_reset_request_create = mock.AsyncMock(spec=protocols.db_password_reset_request_insert.Protocol)
    manager.user_password_reset_mail_send = mock.AsyncMock(spec=combinators.user_password_reset_mail_send.Combinator)

    # Instantiate combinator
    combinator = Combinator(
        transaction_atomic=manager.transaction_atomic,
        db_user_select_by_email=manager.db_user_select_by_email,
        db_password_reset_request_exists=manager.db_password_reset_request_exists,
        db_password_reset_request_delete_by_user_id=manager.db_password_reset_request_delete_by_user_id,
        secret_token_generate=manager.secret_token_generate,
        db_password_reset_request_create=manager.db_password_reset_request_create,
        user_password_reset_mail_send=manager.user_password_reset_mail_send,
    )

    # Execute combinator
    await combinator(email=user.email)

    # Assert depndency calls
    assert manager.mock_calls == [
        mock.call.transaction_atomic(),
        mock.call.context_manager.__aenter__(),
        mock.call.db_user_select_by_email(email=user.email),
        mock.call.db_password_reset_request_exists(user_id=user.id),
        mock.call.db_password_reset_request_delete_by_user_id(user_id=user.id),
        mock.call.secret_token_generate(),
        mock.call.db_password_reset_request_create(user_id=user.id, token=mock.sentinel.token),
        mock.call.user_password_reset_mail_send(email=user.email, token=mock.sentinel.token),
        mock.call.context_manager.__aexit__(None, None, None),
    ]
