import typing

import pytest
from starlette.applications import Starlette
from starlette.endpoints import HTTPEndpoint
from starlette.middleware import Middleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse, Response
from starlette.routing import Route
from starlette.testclient import TestClient

from charaxiv.application.middleware.sameorigin import SameOriginMiddleware


class Endpoint(HTTPEndpoint):
    async def get(self, request: Request) -> Response:
        return PlainTextResponse("OK")

    async def post(self, request: Request) -> Response:
        return PlainTextResponse("OK")


ALLOWED_ORIGIN = "https://example.com"
BAD_ORIGIN = "http://example.com"


@pytest.mark.parametrize("method,headers,expected_status_code", [
    ("get", None, 200),
    ("post", dict(origin=ALLOWED_ORIGIN), 200),
    ("post", None, 403),
    ("post", dict(origin=BAD_ORIGIN), 403)
])
def test_sameorigin(method: str, headers: typing.Optional[typing.Mapping[str, str]], expected_status_code: int) -> None:
    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(SameOriginMiddleware, allow_origins=[ALLOWED_ORIGIN])],
    )

    with TestClient(app) as client:
        out = client.request(method, "/", headers=headers)
        assert out.status_code == expected_status_code
