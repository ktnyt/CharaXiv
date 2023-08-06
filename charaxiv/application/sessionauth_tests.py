import contextlib
import typing
from unittest import mock
from uuid import UUID

from argon2 import PasswordHasher
from injector import InstanceProvider
from pydantic import BaseModel
from starlette.applications import Starlette
from starlette.authentication import requires
from starlette.endpoints import HTTPEndpoint
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.routing import Route
from starlette.status import (HTTP_201_CREATED, HTTP_204_NO_CONTENT,
                              HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN)
from starlette.testclient import TestClient
from uuid6 import uuid7

from charaxiv import combinators, integrations, lib, settings, types
from charaxiv.application.sessionauth import SessionAuthBackend
from charaxiv.combinators.user_authenticate import UserWithIDNotFoundException


class PostParams(BaseModel):
    user_id: str


class Endpoint(HTTPEndpoint):
    @requires([types.user.Scope.ADMIN])
    async def get(self, request: Request) -> Response:
        return Response(status_code=HTTP_204_NO_CONTENT)

    async def post(self, request: Request) -> Response:
        params = PostParams(**(await request.json()))
        request.session[settings.SESSION_USERID_KEY] = params.user_id
        return Response(status_code=HTTP_201_CREATED)

    async def delete(self, request: Request) -> Response:
        if settings.SESSION_USERID_KEY in request.session:
            request.session.pop(settings.SESSION_USERID_KEY)
        return Response(status_code=HTTP_204_NO_CONTENT)


def test_sessionauth(password_hasher: PasswordHasher) -> None:
    base_user = types.user.User(
        id=uuid7(),
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.BASE,
    )

    admin_user = types.user.User(
        id=uuid7(),
        email="test@example.com",
        username="username",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    )

    def user_authenticate_side_effect(user_id: UUID) -> types.user.User:
        if user_id == base_user.id:
            return base_user
        if user_id == admin_user.id:
            return admin_user
        raise UserWithIDNotFoundException(user_id)

    manager = mock.Mock()
    manager.user_authenticate = mock.AsyncMock(spec=combinators.user_authenticate.Combinator, side_effect=user_authenticate_side_effect)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_authenticate.Combinator, to=InstanceProvider(manager.user_authenticate))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[
            Middleware(SessionMiddleware, secret_key=settings.STARLETTE_KEY),
            Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan),
            Middleware(AuthenticationMiddleware, backend=SessionAuthBackend()),
        ],
    )

    with TestClient(app) as client:
        out = client.get("/")
        assert out.status_code == HTTP_403_FORBIDDEN

        out = client.post("/", json=PostParams(user_id=str(base_user.id)).model_dump())
        assert out.status_code == HTTP_201_CREATED

        out = client.get("/")
        assert out.status_code == HTTP_403_FORBIDDEN

        out = client.post("/", json=PostParams(user_id=str(admin_user.id)).model_dump())
        assert out.status_code == HTTP_201_CREATED

        out = client.get("/")
        assert out.status_code == HTTP_204_NO_CONTENT

        out = client.post("/", json=PostParams(user_id=str(uuid7())).model_dump())
        assert out.status_code == HTTP_201_CREATED

        out = client.get("/")
        assert out.status_code == HTTP_400_BAD_REQUEST

        out = client.get("/")
        assert out.status_code == HTTP_403_FORBIDDEN
