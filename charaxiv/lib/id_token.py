from __future__ import annotations

from uuid import UUID

import base58


class IDToken(str):
    def __init__(self, token: str):
        # check if token is a 22 digit base58 string
        if not (len(token) == 22 and all(c in base58.alphabet for c in token.encode())):
            raise ValueError(f'invalid IDToken: {token!r}')
        self.token = token

    @classmethod
    def from_uuid(cls, uuid: UUID) -> IDToken:
        return cls(f'{base58.b58encode(uuid.bytes).decode():1>22}')

    def to_uuid(self) -> UUID:
        return UUID(bytes=base58.b58decode(self.token.lstrip('1')))

    def __repr__(self) -> str:
        return f'IDToken({self.token!r})'  # pragma: no cover
