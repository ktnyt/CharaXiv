from injector import Binder

from charaxiv import adapters, protocols

__all__ = ["configure"]


def configure(binder: Binder) -> None:
    binder.bind(protocols.db_user_select_by_email.Protocol, to=adapters.db_user_select_by_email.Adapter)
    binder.bind(protocols.db_password_reset_request_exists.Protocol, to=adapters.db_password_reset_request_exists.Adapter)
    binder.bind(protocols.password_verify.Protocol, to=adapters.password_verify.Adapter)
    binder.bind(protocols.db_character_image_insert.Protocol, to=adapters.db_character_image_insert.Adapter)
    binder.bind(protocols.secret_token_generate.Protocol, to=adapters.secret_token_generate.Adapter)
    binder.bind(protocols.db_user_select_by_id.Protocol, to=adapters.db_user_select_by_id.Adapter)
    binder.bind(protocols.db_user_with_email_exists.Protocol, to=adapters.db_user_with_email_exists.Adapter)
    binder.bind(protocols.db_registration_insert.Protocol, to=adapters.db_registration_insert.Adapter)
    binder.bind(protocols.db_password_reset_request_delete_by_user_id.Protocol, to=adapters.db_password_reset_request_delete_by_user_id.Adapter)
    binder.bind(protocols.db_registration_delete_by_email.Protocol, to=adapters.db_registration_delete_by_email.Adapter)
    binder.bind(protocols.db_user_password_update_by_id.Protocol, to=adapters.db_user_password_update_by_id.Adapter)
    binder.bind(protocols.datetime_diff_gt.Protocol, to=adapters.datetime_diff_gt.Adapter)
    binder.bind(protocols.db_password_reset_request_delete_by_token.Protocol, to=adapters.db_password_reset_request_delete_by_token.Adapter)
    binder.bind(protocols.db_character_filter_by_owner.Protocol, to=adapters.db_character_filter_by_owner.Adapter)
    binder.bind(protocols.db_password_reset_request_insert.Protocol, to=adapters.db_password_reset_request_insert.Adapter)
    binder.bind(protocols.db_user_with_username_exists.Protocol, to=adapters.db_user_with_username_exists.Adapter)
    binder.bind(protocols.db_registration_exists.Protocol, to=adapters.db_registration_exists.Adapter)
    binder.bind(protocols.db_character_omit_update.Protocol, to=adapters.db_character_omit_update.Adapter)
    binder.bind(protocols.db_character_tags_update.Protocol, to=adapters.db_character_tags_update.Adapter)
    binder.bind(protocols.mail_send.Protocol, to=adapters.mail_send.Adapter)
    binder.bind(protocols.db_password_reset_request_select_by_token.Protocol, to=adapters.db_password_reset_request_select_by_token.Adapter)
    binder.bind(protocols.db_character_insert.Protocol, to=adapters.db_character_insert.Adapter)
    binder.bind(protocols.db_registration_delete_by_token.Protocol, to=adapters.db_registration_delete_by_token.Adapter)
    binder.bind(protocols.db_user_insert.Protocol, to=adapters.db_user_insert.Adapter)
    binder.bind(protocols.password_hash.Protocol, to=adapters.password_hash.Adapter)
    binder.bind(protocols.db_registration_select_by_token.Protocol, to=adapters.db_registration_select_by_token.Adapter)
    binder.bind(protocols.transaction_atomic.Protocol, to=adapters.transaction_atomic.Adapter)
