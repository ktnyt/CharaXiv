from injector import Injector
from pydantic import BaseModel, EmailStr, field_validator
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_200_OK, HTTP_201_CREATED

from charaxiv import combinators, integrations, lib
from charaxiv.application.response import AppResponse, ResponseContent


class PostParams(BaseModel, strict=True):
    email: EmailStr


class PutParams(BaseModel, strict=True):
    token: str
    password: str

    password_validate = field_validator('password')(integrations.pydantic.PasswordValidator())


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PostParams),
        integrations.starlette.raises(
            combinators.user_password_reset_request.UserWithEmailNotFoundException,
            AppResponse(ResponseContent(error="UserWithEmailNotFound")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_password_reset_request.Combinator)
        await exec(email=params.email)
        return AppResponse(ResponseContent())

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PutParams),
        integrations.starlette.raises(
            combinators.user_password_reset.PasswordResetRequestNotFoundException,
            AppResponse(ResponseContent(error="PasswordResetRequestNotFound")),
        ),
        integrations.starlette.raises(
            combinators.user_password_reset.PasswordResetRequestExpiredException,
            AppResponse(ResponseContent(error="PasswordResetRequestExpired")),
        ),
    )
    async def put(self, request: Request, injector: Injector, params: PutParams) -> Response:
        exec = injector.get(combinators.user_password_reset.Combinator)
        await exec(token=params.token, password=params.password)
        return AppResponse(ResponseContent())
