import contextlib
import secrets
import typing
from unittest import mock

import pytest
from injector import InstanceProvider
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.routing import Route
from starlette.status import (HTTP_200_OK, HTTP_201_CREATED,
                              HTTP_400_BAD_REQUEST,
                              HTTP_405_METHOD_NOT_ALLOWED)
from starlette.testclient import TestClient

from charaxiv import combinators, integrations, lib
from charaxiv.application.endpoints.password_reset import (Endpoint,
                                                           PostParams,
                                                           PutParams)


@pytest.mark.parametrize("method", ["get", "patch", "delete"])
def test_login__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_password_reset__post__201() -> None:
    email = "text@example.com"

    manager = mock.Mock()
    manager.user_password_reset_request = mock.AsyncMock(spec=combinators.user_password_reset_request.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_password_reset_request.Combinator, to=InstanceProvider(manager.user_password_reset_request))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )
    with TestClient(app) as client:
        out = client.post("/", json=PostParams(email=email).model_dump())
        assert out.status_code == HTTP_201_CREATED
        assert out.json() == dict(error=None)

    assert manager.mock_calls == [
        mock.call.user_password_reset_request(email=email),
    ]


def test_password_reset__put__201() -> None:
    token = secrets.token_urlsafe(32)
    password = lib.password.generate()

    manager = mock.Mock()
    manager.user_password_reset = mock.AsyncMock(spec=combinators.user_password_reset.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_password_reset.Combinator, to=InstanceProvider(manager.user_password_reset))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )
    with TestClient(app) as client:
        out = client.put("/", json=PutParams(token=token, password=password).model_dump())
        assert out.status_code == HTTP_200_OK
        assert out.json() == dict(error=None)

    assert manager.mock_calls == [
        mock.call.user_password_reset(token=token, password=password),
    ]


@pytest.mark.parametrize("password", [
    lib.password.generate(length=10),
    lib.password.generate(lower=False),
    lib.password.generate(upper=False),
    lib.password.generate(digit=False),
    lib.password.generate(symbol=False),
])
def test_password_reset__put__400(password: str) -> None:
    token = secrets.token_urlsafe(32)

    manager = mock.Mock()
    manager.user_password_reset = mock.AsyncMock(spec=combinators.user_password_reset.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_password_reset.Combinator, to=InstanceProvider(manager.user_password_reset))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )
    with TestClient(app) as client:
        out = client.put("/", json=dict(token=token, password=password))
        assert out.status_code == HTTP_400_BAD_REQUEST

    assert manager.mock_calls == []
