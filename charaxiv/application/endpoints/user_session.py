from injector import Injector
from pydantic import BaseModel
from starlette.authentication import BaseUser
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response

from charaxiv import combinators, integrations, lib, settings
from charaxiv.application.response import AppResponse, ResponseContent


class PostParams(BaseModel, strict=True):
    email: str
    password: str


class Endpoint(HTTPEndpoint):
    async def get(self, request: Request) -> Response:
        assert isinstance(request.user, BaseUser)
        return AppResponse(ResponseContent(value=dict(authenticated=request.user.is_authenticated)))

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate_body(PostParams),
        integrations.starlette.raises(
            combinators.user_login.UserVerificationException,
            AppResponse(ResponseContent(error="UserVerificationFailed")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_login.Combinator)
        user_id = await exec(email=params.email, password=params.password)
        request.session[settings.SESSION_USERID_KEY] = str(user_id)
        return AppResponse(ResponseContent())

    async def delete(self, request: Request) -> Response:
        if settings.SESSION_USERID_KEY in request.session:
            request.session.pop(settings.SESSION_USERID_KEY)
        return AppResponse(ResponseContent())
