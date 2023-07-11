import typing

import pytest
from starlette.applications import Starlette
from starlette.endpoints import HTTPEndpoint
from starlette.middleware import Middleware
from starlette.requests import Request
from starlette.responses import PlainTextResponse, Response
from starlette.routing import Route
from starlette.testclient import TestClient

from charaxiv.application.middleware.customheader import CustomHeaderMiddleware


class Endpoint(HTTPEndpoint):
    async def get(self, request: Request) -> Response:
        return PlainTextResponse("OK")


CUSTOM_HEADER = "X-CUSTOM-HEADER"


@pytest.mark.parametrize("headers,expected_status_code", [
    ({CUSTOM_HEADER: "1"}, 200),
    (None, 403),
])
def test_customheader(headers: typing.Optional[typing.Mapping[str, str]], expected_status_code: int) -> None:
    custom_header = "X-CUSTOM-HEADER"

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[Middleware(CustomHeaderMiddleware, custom_header=custom_header)],
    )

    with TestClient(app) as client:
        out = client.get("/", headers=headers)
        assert out.status_code == expected_status_code
