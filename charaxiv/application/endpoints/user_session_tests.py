import contextlib
import typing
from dataclasses import dataclass
from unittest import mock
from uuid import UUID

import pytest
from injector import InstanceProvider
from starlette.applications import Starlette
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                      BaseUser, SimpleUser,
                                      UnauthenticatedUser)
from starlette.endpoints import HTTPEndpoint
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import HTTPConnection, Request
from starlette.responses import Response
from starlette.routing import Route
from starlette.status import (HTTP_200_OK, HTTP_201_CREATED,
                              HTTP_204_NO_CONTENT, HTTP_405_METHOD_NOT_ALLOWED)
from starlette.testclient import TestClient
from uuid6 import uuid7

from charaxiv import combinators, integrations, lib, settings
from charaxiv.application.endpoints.user_session import Endpoint, PostParams


@pytest.mark.parametrize("method", ["put", "patch"])
def test_user_session__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


class SessionCheckEndpoint(HTTPEndpoint):
    def get(self, request: Request) -> Response:
        request_user_id = request.query_params.get("user_id")
        session_user_id = request.session.get(settings.SESSION_USERID_KEY)
        assert request_user_id == session_user_id
        return Response(status_code=HTTP_204_NO_CONTENT)


@dataclass
class UserLoginSideEffect:
    user_id: UUID
    email: str
    password: str

    def __call__(self, /, *, email: str, password: str) -> UUID:
        if email == self.email and password == self.password:
            return self.user_id
        raise combinators.user_login.UserVerificationException(email)


@pytest.mark.asyncio
async def test_user_session__get_post_delete() -> None:
    user_id = uuid7()
    email = "test@example.com"
    password = lib.password.generate()

    user_login_side_effect = UserLoginSideEffect(user_id=user_id, email=email, password=password)

    async def authenticate_side_effect(conn: HTTPConnection) -> typing.Tuple[AuthCredentials, BaseUser]:
        if settings.SESSION_USERID_KEY in conn.session:
            return AuthCredentials("authenticated"), SimpleUser(username=str(user_id))
        return AuthCredentials(), UnauthenticatedUser()

    manager = mock.Mock()
    manager.user_login = mock.AsyncMock(spec=combinators.user_login.Combinator, side_effect=user_login_side_effect)
    manager.auth_backend = mock.Mock(spec=AuthenticationBackend)
    manager.auth_backend.authenticate = mock.AsyncMock(side_effect=authenticate_side_effect)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_login.Combinator, to=InstanceProvider(manager.user_login))

    app = Starlette(
        routes=[
            Route("/", endpoint=Endpoint),
            Route("/session_check", endpoint=SessionCheckEndpoint)
        ],
        middleware=[
            Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan),
            Middleware(SessionMiddleware, secret_key=settings.STARLETTE_KEY),
            Middleware(AuthenticationMiddleware, backend=manager.auth_backend),
        ],
    )

    # Test call
    with TestClient(app) as client:
        # Login
        out = client.post("/", json=PostParams(email=email, password=password).model_dump())
        assert out.status_code == HTTP_201_CREATED
        assert out.json() == dict(error=None)
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
            mock.call.user_login(email=email, password=password),
        ]
        manager.reset_mock()

        # Session should be persisted
        out = client.get(f"/session_check?user_id={user_id}")
        assert out.status_code == HTTP_204_NO_CONTENT
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Should be authenticated
        out = client.get("/")
        assert out.status_code == HTTP_200_OK
        assert out.json() == dict(
            content=dict(authenticated=True),
            error=None,
        )
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Logout
        out = client.delete("/")
        assert out.status_code == HTTP_204_NO_CONTENT
        assert out.json() == dict(error=None)
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Should be unauthenticated
        out = client.get("/")
        assert out.status_code == HTTP_200_OK
        assert out.json() == dict(
            content=dict(authenticated=False),
            error=None,
        )
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Session should be reset
        out = client.get("/session_check")
        assert out.status_code == HTTP_204_NO_CONTENT
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Logout can be called without being logged in
        out = client.delete("/")
        assert out.status_code == HTTP_204_NO_CONTENT
        assert out.json() == dict(error=None)
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
        ]
        manager.reset_mock()

        # Login with invalid credentials
        out = client.post("/", json=PostParams(email="test@example.org", password=password).model_dump())
        assert out.status_code == HTTP_200_OK
        assert out.json() == dict(error="UserVerificationFailed")
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
            mock.call.user_login(email="test@example.org", password=password),
        ]
        manager.reset_mock()

        invalid_password = lib.password.generate()
        out = client.post("/", json=PostParams(email=email, password=invalid_password).model_dump())
        assert out.status_code == HTTP_200_OK
        assert out.json() == dict(error="UserVerificationFailed")
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(integrations.mock.TypeIs(HTTPConnection)),
            mock.call.user_login(email="test@example.com", password=invalid_password),
        ]
        manager.reset_mock()
