from injector import Injector

from charaxiv import adapters, protocols

from .bindings import configure
from .bindings_mocks import configure_mocks


def test_configure() -> None:
    injector = Injector([configure_mocks, configure])

    db_registration_select_by_token = injector.get(protocols.db_registration_select_by_token.Protocol)
    assert type(db_registration_select_by_token) == adapters.db_registration_select_by_token.Adapter
    assert isinstance(db_registration_select_by_token, protocols.db_registration_select_by_token.Protocol)

    db_registration_insert = injector.get(protocols.db_registration_insert.Protocol)
    assert type(db_registration_insert) == adapters.db_registration_insert.Adapter
    assert isinstance(db_registration_insert, protocols.db_registration_insert.Protocol)

    db_password_reset_request_exists = injector.get(protocols.db_password_reset_request_exists.Protocol)
    assert type(db_password_reset_request_exists) == adapters.db_password_reset_request_exists.Adapter
    assert isinstance(db_password_reset_request_exists, protocols.db_password_reset_request_exists.Protocol)

    transaction_atomic = injector.get(protocols.transaction_atomic.Protocol)
    assert type(transaction_atomic) == adapters.transaction_atomic.Adapter
    assert isinstance(transaction_atomic, protocols.transaction_atomic.Protocol)

    password_verify = injector.get(protocols.password_verify.Protocol)
    assert type(password_verify) == adapters.password_verify.Adapter
    assert isinstance(password_verify, protocols.password_verify.Protocol)

    secret_token_generate = injector.get(protocols.secret_token_generate.Protocol)
    assert type(secret_token_generate) == adapters.secret_token_generate.Adapter
    assert isinstance(secret_token_generate, protocols.secret_token_generate.Protocol)

    db_password_reset_request_insert = injector.get(protocols.db_password_reset_request_insert.Protocol)
    assert type(db_password_reset_request_insert) == adapters.db_password_reset_request_insert.Adapter
    assert isinstance(db_password_reset_request_insert, protocols.db_password_reset_request_insert.Protocol)

    db_character_insert = injector.get(protocols.db_character_insert.Protocol)
    assert type(db_character_insert) == adapters.db_character_insert.Adapter
    assert isinstance(db_character_insert, protocols.db_character_insert.Protocol)

    db_user_select_by_email = injector.get(protocols.db_user_select_by_email.Protocol)
    assert type(db_user_select_by_email) == adapters.db_user_select_by_email.Adapter
    assert isinstance(db_user_select_by_email, protocols.db_user_select_by_email.Protocol)

    db_user_insert = injector.get(protocols.db_user_insert.Protocol)
    assert type(db_user_insert) == adapters.db_user_insert.Adapter
    assert isinstance(db_user_insert, protocols.db_user_insert.Protocol)

    db_user_password_update_by_id = injector.get(protocols.db_user_password_update_by_id.Protocol)
    assert type(db_user_password_update_by_id) == adapters.db_user_password_update_by_id.Adapter
    assert isinstance(db_user_password_update_by_id, protocols.db_user_password_update_by_id.Protocol)

    password_hash = injector.get(protocols.password_hash.Protocol)
    assert type(password_hash) == adapters.password_hash.Adapter
    assert isinstance(password_hash, protocols.password_hash.Protocol)

    mail_send = injector.get(protocols.mail_send.Protocol)
    assert type(mail_send) == adapters.mail_send.Adapter
    assert isinstance(mail_send, protocols.mail_send.Protocol)

    db_registration_delete_by_email = injector.get(protocols.db_registration_delete_by_email.Protocol)
    assert type(db_registration_delete_by_email) == adapters.db_registration_delete_by_email.Adapter
    assert isinstance(db_registration_delete_by_email, protocols.db_registration_delete_by_email.Protocol)

    db_registration_delete_by_token = injector.get(protocols.db_registration_delete_by_token.Protocol)
    assert type(db_registration_delete_by_token) == adapters.db_registration_delete_by_token.Adapter
    assert isinstance(db_registration_delete_by_token, protocols.db_registration_delete_by_token.Protocol)

    db_user_with_email_exists = injector.get(protocols.db_user_with_email_exists.Protocol)
    assert type(db_user_with_email_exists) == adapters.db_user_with_email_exists.Adapter
    assert isinstance(db_user_with_email_exists, protocols.db_user_with_email_exists.Protocol)

    db_user_with_username_exists = injector.get(protocols.db_user_with_username_exists.Protocol)
    assert type(db_user_with_username_exists) == adapters.db_user_with_username_exists.Adapter
    assert isinstance(db_user_with_username_exists, protocols.db_user_with_username_exists.Protocol)

    db_password_reset_request_delete = injector.get(protocols.db_password_reset_request_delete.Protocol)
    assert type(db_password_reset_request_delete) == adapters.db_password_reset_request_delete.Adapter
    assert isinstance(db_password_reset_request_delete, protocols.db_password_reset_request_delete.Protocol)

    db_registration_exists = injector.get(protocols.db_registration_exists.Protocol)
    assert type(db_registration_exists) == adapters.db_registration_exists.Adapter
    assert isinstance(db_registration_exists, protocols.db_registration_exists.Protocol)

    db_password_reset_request_select_by_token = injector.get(protocols.db_password_reset_request_select_by_token.Protocol)
    assert type(db_password_reset_request_select_by_token) == adapters.db_password_reset_request_select_by_token.Adapter
    assert isinstance(db_password_reset_request_select_by_token, protocols.db_password_reset_request_select_by_token.Protocol)

    db_user_select_by_id = injector.get(protocols.db_user_select_by_id.Protocol)
    assert type(db_user_select_by_id) == adapters.db_user_select_by_id.Adapter
    assert isinstance(db_user_select_by_id, protocols.db_user_select_by_id.Protocol)
