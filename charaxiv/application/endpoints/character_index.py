import typing

from injector import Injector
from pydantic import BaseModel
from starlette.authentication import requires
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response

from charaxiv import combinators, constants, integrations, lib, types
from charaxiv.application.response import AppResponse, ResponseContent


class PostParams(BaseModel):
    system: types.system.System
    data: typing.Any
    omit: typing.List[str]


class ResponseCharacterSummary(BaseModel, strict=True, arbitrary_types_allowed=True):
    id: str
    name: str
    tags: typing.List[str]
    images: typing.List[str]

    def __init__(self, character_summary: types.character.CharacterSummary):
        super().__init__(
            id=str(lib.id_token.IDToken.from_uuid(character_summary.id)),
            name=character_summary.name,
            tags=character_summary.tags,
            images=[str(lib.id_token.IDToken.from_uuid(image)) for image in character_summary.images],
        )


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
    )
    @requires(types.user.Group.BASE.value)
    async def get(self, request: Request, injector: Injector) -> Response:
        assert type(request.user) == types.user.User
        until_character_id = lib.utils.maybe(request.query_params.get("until_character_id"), lambda v: lib.id_token.IDToken(v).to_uuid())
        exec = injector.get(combinators.character_list_for_user.Combinator)
        character_summaries = await exec(
            user_id=request.user.id,
            until_character_id=until_character_id,
            limit=constants.CHARACTER_LIST_LIMIT_MAX,
        )
        return AppResponse(ResponseContent(
            error=None,
            value=dict(character_summaries=[
                ResponseCharacterSummary(character_summary).model_dump() for character_summary in character_summaries
            ]),
        ))

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PostParams),
    )
    @requires(types.user.Group.BASE.value)
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        assert type(request.user) == types.user.User
        exec = injector.get(combinators.character_create_new.Combinator)
        character_id = await exec(owner_id=request.user.id, system=params.system, data=params.data, omit=params.omit)
        character_id_token = lib.id_token.IDToken.from_uuid(character_id)
        return AppResponse(ResponseContent(value=dict(character_id=character_id_token)))
