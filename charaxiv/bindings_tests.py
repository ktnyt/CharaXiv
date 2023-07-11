from injector import Injector

from charaxiv import adapters, protocols

from .bindings import configure
from .bindings_mocks import configure_mocks


def test_configure() -> None:
    injector = Injector([configure_mocks, configure])

    registration_delete = injector.get(protocols.registration_delete.Protocol)
    assert type(registration_delete) == adapters.registration_delete.Adapter
    assert isinstance(registration_delete, protocols.registration_delete.Protocol)

    user_password_update_by_id = injector.get(protocols.user_password_update_by_id.Protocol)
    assert type(user_password_update_by_id) == adapters.user_password_update_by_id.Adapter
    assert isinstance(user_password_update_by_id, protocols.user_password_update_by_id.Protocol)

    secret_token_generate = injector.get(protocols.secret_token_generate.Protocol)
    assert type(secret_token_generate) == adapters.secret_token_generate.Adapter
    assert isinstance(secret_token_generate, protocols.secret_token_generate.Protocol)

    user_get_by_id = injector.get(protocols.user_get_by_id.Protocol)
    assert type(user_get_by_id) == adapters.user_get_by_id.Adapter
    assert isinstance(user_get_by_id, protocols.user_get_by_id.Protocol)

    password_reset_request_get_by_token = injector.get(protocols.password_reset_request_get_by_token.Protocol)
    assert type(password_reset_request_get_by_token) == adapters.password_reset_request_get_by_token.Adapter
    assert isinstance(password_reset_request_get_by_token, protocols.password_reset_request_get_by_token.Protocol)

    user_get_by_email = injector.get(protocols.user_get_by_email.Protocol)
    assert type(user_get_by_email) == adapters.user_get_by_email.Adapter
    assert isinstance(user_get_by_email, protocols.user_get_by_email.Protocol)

    password_reset_request_delete = injector.get(protocols.password_reset_request_delete.Protocol)
    assert type(password_reset_request_delete) == adapters.password_reset_request_delete.Adapter
    assert isinstance(password_reset_request_delete, protocols.password_reset_request_delete.Protocol)

    password_reset_request_create = injector.get(protocols.password_reset_request_create.Protocol)
    assert type(password_reset_request_create) == adapters.password_reset_request_create.Adapter
    assert isinstance(password_reset_request_create, protocols.password_reset_request_create.Protocol)

    registration_exists = injector.get(protocols.registration_exists.Protocol)
    assert type(registration_exists) == adapters.registration_exists.Adapter
    assert isinstance(registration_exists, protocols.registration_exists.Protocol)

    password_hash = injector.get(protocols.password_hash.Protocol)
    assert type(password_hash) == adapters.password_hash.Adapter
    assert isinstance(password_hash, protocols.password_hash.Protocol)

    user_with_username_exists = injector.get(protocols.user_with_username_exists.Protocol)
    assert type(user_with_username_exists) == adapters.user_with_username_exists.Adapter
    assert isinstance(user_with_username_exists, protocols.user_with_username_exists.Protocol)

    password_verify = injector.get(protocols.password_verify.Protocol)
    assert type(password_verify) == adapters.password_verify.Adapter
    assert isinstance(password_verify, protocols.password_verify.Protocol)

    registration_get_by_token = injector.get(protocols.registration_get_by_token.Protocol)
    assert type(registration_get_by_token) == adapters.registration_get_by_token.Adapter
    assert isinstance(registration_get_by_token, protocols.registration_get_by_token.Protocol)

    transaction_atomic = injector.get(protocols.transaction_atomic.Protocol)
    assert type(transaction_atomic) == adapters.transaction_atomic.Adapter
    assert isinstance(transaction_atomic, protocols.transaction_atomic.Protocol)

    mail_send = injector.get(protocols.mail_send.Protocol)
    assert type(mail_send) == adapters.mail_send.Adapter
    assert isinstance(mail_send, protocols.mail_send.Protocol)

    registration_create = injector.get(protocols.registration_create.Protocol)
    assert type(registration_create) == adapters.registration_create.Adapter
    assert isinstance(registration_create, protocols.registration_create.Protocol)

    user_create = injector.get(protocols.user_create.Protocol)
    assert type(user_create) == adapters.user_create.Adapter
    assert isinstance(user_create, protocols.user_create.Protocol)

    password_reset_request_exists = injector.get(protocols.password_reset_request_exists.Protocol)
    assert type(password_reset_request_exists) == adapters.password_reset_request_exists.Adapter
    assert isinstance(password_reset_request_exists, protocols.password_reset_request_exists.Protocol)

    user_with_email_exists = injector.get(protocols.user_with_email_exists.Protocol)
    assert type(user_with_email_exists) == adapters.user_with_email_exists.Adapter
    assert isinstance(user_with_email_exists, protocols.user_with_email_exists.Protocol)
