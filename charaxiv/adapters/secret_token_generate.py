import secrets

from charaxiv import protocols


class Adapter(protocols.secret_token_generate.Protocol):
    def __call__(self) -> str:
        return secrets.token_urlsafe(32)
