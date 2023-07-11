import contextlib
import secrets
import typing
from unittest import mock

import pytest
from injector import InstanceProvider
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.routing import Route
from starlette.status import (HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
                              HTTP_405_METHOD_NOT_ALLOWED)
from starlette.testclient import TestClient

from charaxiv import combinators, integrations, lib
from charaxiv.application.endpoints.user_activate import Endpoint, PostParams


@pytest.mark.parametrize("method", ["get", "put", "patch", "delete"])
def test_login__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_user_activate__post__201() -> None:
    token = secrets.token_urlsafe(32)
    username = "username"
    password = "I'mV3ry$trong"

    manager = mock.Mock()
    manager.user_activate = mock.AsyncMock(spec=combinators.user_activate.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_activate.Combinator, to=InstanceProvider(manager.user_activate))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )

    with TestClient(app) as client:
        out = client.post("/", json=PostParams(
            token=token,
            username=username,
            password=password,
        ).model_dump())
        assert out.status_code == HTTP_201_CREATED
        assert out.json() == dict(error=None)

        assert manager.mock_calls == [
            mock.call.user_activate(
                token=token,
                username=username,
                password=password,
            ),
        ]
        manager.reset_mock()


@pytest.mark.parametrize("password", [
    lib.password.generate(length=10),
    lib.password.generate(lower=False),
    lib.password.generate(upper=False),
    lib.password.generate(digit=False),
    lib.password.generate(symbol=False),
])
def test_user_activate__post__weak_password(password: str) -> None:
    token = secrets.token_urlsafe(32)
    username = "username"

    manager = mock.Mock()
    manager.user_activate = mock.AsyncMock(spec=combinators.user_activate.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_activate.Combinator, to=InstanceProvider(manager.user_activate))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )

    with TestClient(app) as client:
        out = client.post("/", json=dict(
            token=token,
            username=username,
            password=password,
        ))
        assert out.status_code == HTTP_400_BAD_REQUEST

        assert manager.mock_calls == []
        manager.reset_mock()
