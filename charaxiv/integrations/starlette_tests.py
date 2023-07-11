import contextlib
import secrets
import typing
from dataclasses import dataclass
from unittest import mock

import pytest
from injector import Injector, InstanceProvider
from pydantic import BaseModel
from starlette.applications import Starlette
from starlette.endpoints import HTTPEndpoint
from starlette.middleware import Middleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse, Response
from starlette.routing import Route
from starlette.status import (HTTP_200_OK, HTTP_400_BAD_REQUEST,
                              HTTP_418_IM_A_TEAPOT)
from starlette.testclient import TestClient

from charaxiv import lib
from charaxiv.integrations.starlette import (AppUser, InjectorMiddleware,
                                             InstallableModuleType, raises,
                                             use_injector, validate)


@dataclass
class SampleUser:
    identity: str
    username: str


def test_charaxiv_user() -> None:
    identity = "identity"
    username = "username"

    sample_user = SampleUser(identity=identity, username=username)
    charaxiv_user = AppUser(
        sample_user,
        identity=lambda user: user.identity,
        display_name=lambda user: user.username,
    )

    assert charaxiv_user.is_authenticated
    assert charaxiv_user.identity == identity
    assert charaxiv_user.display_name == username


class Params(BaseModel, strict=True):
    number: int


class ValidationEndpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(validate(Params))
    async def post(self, request: Request, params: Params) -> Response:
        return PlainTextResponse(f"number={params.number}")


@pytest.mark.parametrize("json,expected_status_code", [
    (dict(number=1), HTTP_200_OK),
    (None, HTTP_400_BAD_REQUEST),
    (dict(number="1"), HTTP_400_BAD_REQUEST),
])
def test_validate(json: typing.Any, expected_status_code: int) -> None:
    app = Starlette(routes=[Route("/", endpoint=ValidationEndpoint)])

    with TestClient(app) as client:
        out = client.post("/", json=json)
        assert out.status_code == expected_status_code


class RaisesEndpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(raises(Exception, Response(status_code=HTTP_418_IM_A_TEAPOT)))
    async def get(self, request: Request) -> Response:
        if request.query_params.get("brew", "tea") != "tea":
            raise Exception("foo")
        return Response(status_code=HTTP_200_OK)


@pytest.mark.parametrize("query_params,expected_status_code", [
    (dict(brew="tea"), HTTP_200_OK),
    (dict(brew="coffee"), HTTP_418_IM_A_TEAPOT),
])
def test_raises(query_params: typing.Mapping[str, str], expected_status_code: int) -> None:
    app = Starlette(routes=[Route("/", endpoint=RaisesEndpoint)])

    with TestClient(app) as client:
        out = client.get("/", params=query_params)
        assert out.status_code == expected_status_code


class InjectorEndpoint(HTTPEndpoint):
    @lib.decorators.method_decorator(use_injector)
    async def get(self, request: Request, injector: Injector) -> Response:
        return PlainTextResponse(injector.get(str))


def test_injector_middleware() -> None:
    manager = mock.Mock()
    manager.request_enter = mock.Mock()
    manager.request_exit = mock.Mock()

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[InstallableModuleType, None]:
        manager.request_enter()
        token = secrets.token_urlsafe(32)
        yield lambda binder: binder.bind(str, to=InstanceProvider(token))
        manager.request_exit()

    app = Starlette(
        routes=[Route("/", endpoint=InjectorEndpoint)],
        middleware=[Middleware(InjectorMiddleware, request_lifespan=request_lifespan)],
    )

    with TestClient(app) as client:
        fst = client.get("/")
        snd = client.get("/")
        assert manager.mock_calls == [
            mock.call.request_enter(),
            mock.call.request_exit(),
            mock.call.request_enter(),
            mock.call.request_exit(),
        ]
        assert fst.text != snd.text
