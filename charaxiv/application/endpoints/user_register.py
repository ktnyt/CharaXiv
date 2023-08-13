from injector import Injector
from pydantic import BaseModel, EmailStr
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response

from charaxiv import combinators, integrations, lib
from charaxiv.application.response import AppResponse, ResponseContent


class PostParams(BaseModel, strict=True):
    email: EmailStr


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PostParams),
        integrations.starlette.raises(
            combinators.user_register.UserWithEmailExistsException,
            AppResponse(ResponseContent(error="UserWithEmailExistsException")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_register.Combinator)
        await exec(email=params.email)
        return AppResponse(ResponseContent())
