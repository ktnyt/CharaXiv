from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton

from charaxiv import protocols, types


class UserWithIDNotFoundException(Exception):
    def __init__(self, userid: UUID) -> None:
        super().__init__(f"User with id '{str(userid)}' not found")


@singleton
@inject
@dataclass
class Combinator:
    user_get_by_id: protocols.user_get_by_id.Protocol

    async def __call__(self, userid: UUID) -> types.user.User:
        user = await self.user_get_by_id(id=userid)
        if user is None:
            raise UserWithIDNotFoundException(userid)
        return user
