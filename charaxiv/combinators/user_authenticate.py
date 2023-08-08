from dataclasses import dataclass
from uuid import UUID

from injector import inject, singleton

from charaxiv import protocols, types


class UserWithIDNotFoundException(Exception):
    def __init__(self, user_id: UUID) -> None:
        super().__init__(f"User with id '{str(user_id)}' not found")


@singleton
@inject
@dataclass
class Combinator:
    db_user_select_by_id: protocols.db_user_select_by_id.Protocol

    async def __call__(self, user_id: UUID) -> types.user.User:
        user = await self.db_user_select_by_id(id=user_id)
        if user is None:
            raise UserWithIDNotFoundException(user_id)
        return user
