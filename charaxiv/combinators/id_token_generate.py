from dataclasses import dataclass

from injector import inject, singleton

from charaxiv import lib, protocols


@singleton
@inject
@dataclass
class Combinator:
    uuid_generate: protocols.uuid_generate.Protocol

    def __call__(self) -> lib.id_token.IDToken:
        uuid = self.uuid_generate()
        return lib.id_token.IDToken.from_uuid(uuid)
