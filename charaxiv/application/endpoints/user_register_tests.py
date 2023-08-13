import contextlib
import typing
from unittest import mock

import pytest
from injector import InstanceProvider
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.routing import Route
from starlette.status import HTTP_200_OK, HTTP_405_METHOD_NOT_ALLOWED
from starlette.testclient import TestClient

from charaxiv import combinators, integrations
from charaxiv.application.endpoints.user_register import Endpoint, PostParams
from charaxiv.application.response import ResponseContent


@pytest.mark.parametrize("method", ["get", "put", "patch", "delete"])
def test_user_register__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_user_register__post__200() -> None:
    email = "text@example.com"

    manager = mock.Mock()
    manager.user_register = mock.AsyncMock(spec=combinators.user_register.Combinator)

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.user_register.Combinator, to=InstanceProvider(manager.user_register))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan)]
    )
    with TestClient(app) as client:
        out = client.post("/", json=PostParams(email=email).model_dump())
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()
        assert manager.mock_calls == [
            mock.call.user_register(email=email),
        ]
        manager.reset_mock()
