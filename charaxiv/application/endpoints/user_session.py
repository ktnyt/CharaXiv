from injector import Injector
from pydantic import BaseModel
from starlette.authentication import BaseUser
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from charaxiv import combinators, integrations, lib, settings
from charaxiv.application.response import AppResponse


class PostParams(BaseModel, strict=True):
    email: str
    password: str


class Endpoint(HTTPEndpoint):
    async def get(self, request: Request) -> Response:
        assert isinstance(request.user, BaseUser)
        return AppResponse(content=dict(
            content=dict(authenticated=request.user.is_authenticated),
            error=None,
        ))

    @lib.decorators.method_decorator(
        integrations.starlette.use_injector,
        integrations.starlette.validate(PostParams),
        integrations.starlette.raises(
            combinators.user_login.UserVerificationException,
            AppResponse(content=dict(error="UserVerificationFailed")),
        ),
    )
    async def post(self, request: Request, injector: Injector, params: PostParams) -> Response:
        exec = injector.get(combinators.user_login.Combinator)
        user_id = await exec(email=params.email, password=params.password)
        request.session[settings.SESSION_USERID_KEY] = str(user_id)
        return AppResponse(
            content=dict(error=None),
            status_code=HTTP_201_CREATED,
        )

    async def delete(self, request: Request) -> Response:
        if settings.SESSION_USERID_KEY in request.session:
            request.session.pop(settings.SESSION_USERID_KEY)
        return AppResponse(
            content=dict(error=None),
            status_code=HTTP_204_NO_CONTENT,
        )
