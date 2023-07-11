from injector import Injector
from pydantic import BaseModel, EmailStr
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_201_CREATED

from charaxiv import combinators, integrations, lib
from charaxiv.application.response import AppResponse


class PostParams(BaseModel, strict=True):
    email: EmailStr


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate(PostParams),
        integrations.starlette.raises(
            combinators.user_register.UserWithEmailExistsException,
            AppResponse(content=dict(error="UserWithEmailExistsException")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_register.Combinator)
        await exec(email=params.email)
        return AppResponse(
            content=dict(error=None),
            status_code=HTTP_201_CREATED
        )
