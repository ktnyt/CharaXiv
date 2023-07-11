from injector import Injector
from pydantic import BaseModel, field_validator
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_201_CREATED

from charaxiv import combinators, integrations, lib
from charaxiv.application.response import AppResponse


class PostParams(BaseModel, strict=True):
    token: str
    username: str
    password: str

    password_validate = field_validator('password')(integrations.pydantic.PasswordValidator())


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate(PostParams),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_activate.Combinator)
        await exec(
            token=params.token,
            username=params.username,
            password=params.password,
        )
        return AppResponse(
            content=dict(error=None),
            status_code=HTTP_201_CREATED,
        )
