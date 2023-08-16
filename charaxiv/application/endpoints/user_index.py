from injector import Injector
from pydantic import BaseModel, EmailStr, field_validator
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response

from charaxiv import combinators, integrations, lib
from charaxiv.application.response import AppResponse, ResponseContent


class PostParams(BaseModel, strict=True):
    email: EmailStr


class PutParams(BaseModel, strict=True):
    token: str
    username: str
    password: str

    password_validate = field_validator('password')(integrations.pydantic.PasswordValidator())


class Endpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PostParams),
        integrations.starlette.raises(
            combinators.user_register.UserWithEmailExistsException,
            AppResponse(ResponseContent(error="UserWithEmailExists")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_register.Combinator)
        await exec(email=params.email)
        return AppResponse(ResponseContent())

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PutParams),
        integrations.starlette.raises(
            combinators.user_activate.RegistrationNotFoundException,
            AppResponse(ResponseContent(error="RegistrationNotFound"))
        ),
        integrations.starlette.raises(
            combinators.user_activate.UserWithEmailExistsException,
            AppResponse(ResponseContent(error="UserWithEmailExists"))
        ),
        integrations.starlette.raises(
            combinators.user_activate.UserWithUsernameExistsException,
            AppResponse(ResponseContent(error="UserWithUsernameExists"))
        ),
        integrations.starlette.raises(
            combinators.user_activate.RegistrationExpiredException,
            AppResponse(ResponseContent(error="RegistrationExpired"))
        ),
    )
    async def put(self, request: Request, injector: Injector, params: PutParams) -> Response:
        exec = injector.get(combinators.user_activate.Combinator)
        await exec(
            token=params.token,
            username=params.username,
            password=params.password,
        )
        return AppResponse(ResponseContent())
