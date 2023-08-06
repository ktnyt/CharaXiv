from injector import Binder

from charaxiv import protocols, adapters

__all__ = ["configure"]


def configure(binder: Binder) -> None:
    binder.bind(protocols.registration_delete_by_email.Protocol, to=adapters.registration_delete_by_email.Adapter)
    binder.bind(protocols.registration_exists.Protocol, to=adapters.registration_exists.Adapter)
    binder.bind(protocols.user_with_username_exists.Protocol, to=adapters.user_with_username_exists.Adapter)
    binder.bind(protocols.password_verify.Protocol, to=adapters.password_verify.Adapter)
    binder.bind(protocols.user_get_by_email.Protocol, to=adapters.user_get_by_email.Adapter)
    binder.bind(protocols.password_reset_request_create.Protocol, to=adapters.password_reset_request_create.Adapter)
    binder.bind(protocols.user_create.Protocol, to=adapters.user_create.Adapter)
    binder.bind(protocols.registration_create.Protocol, to=adapters.registration_create.Adapter)
    binder.bind(protocols.mail_send.Protocol, to=adapters.mail_send.Adapter)
    binder.bind(protocols.user_with_email_exists.Protocol, to=adapters.user_with_email_exists.Adapter)
    binder.bind(protocols.user_password_update_by_id.Protocol, to=adapters.user_password_update_by_id.Adapter)
    binder.bind(protocols.registration_delete_by_token.Protocol, to=adapters.registration_delete_by_token.Adapter)
    binder.bind(protocols.transaction_atomic.Protocol, to=adapters.transaction_atomic.Adapter)
    binder.bind(protocols.password_hash.Protocol, to=adapters.password_hash.Adapter)
    binder.bind(protocols.password_reset_request_delete.Protocol, to=adapters.password_reset_request_delete.Adapter)
    binder.bind(protocols.registration_get_by_token.Protocol, to=adapters.registration_get_by_token.Adapter)
    binder.bind(protocols.password_reset_request_get_by_token.Protocol, to=adapters.password_reset_request_get_by_token.Adapter)
    binder.bind(protocols.user_get_by_id.Protocol, to=adapters.user_get_by_id.Adapter)
    binder.bind(protocols.secret_token_generate.Protocol, to=adapters.secret_token_generate.Adapter)
    binder.bind(protocols.password_reset_request_exists.Protocol, to=adapters.password_reset_request_exists.Adapter)
