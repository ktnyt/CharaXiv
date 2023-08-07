import typing

from injector import Injector
from pydantic import BaseModel
from starlette.authentication import requires
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response

from charaxiv import combinators, integrations, lib, types
from charaxiv.application.response import AppResponse


class PostParams(BaseModel):
    system: types.system.System
    data: typing.Any


class Endpoint(HTTPEndpoint):
    async def get(self, request: Request) -> Response:
        raise NotImplementedError()

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate(PostParams),
    )
    @requires(types.user.Group.BASE.value)
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        assert type(request.user) == types.user.User
        exec = injector.get(combinators.character_create_new.Combinator)
        character_id = await exec(owner_id=request.user.id, system=params.system, data=params.data)
        return AppResponse(content=dict(error=None, content=dict(character_id=character_id)))
