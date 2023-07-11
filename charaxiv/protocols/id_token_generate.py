import typing

from charaxiv.lib import id_token


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self) -> id_token.IDToken:
        ...
