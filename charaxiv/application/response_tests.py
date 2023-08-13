import orjson
from starlette.applications import Starlette
from starlette.endpoints import HTTPEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.routing import Route
from starlette.testclient import TestClient

from charaxiv.application.response import AppResponse, ResponseContent


class AppEndpoint(HTTPEndpoint):
    async def post(self, request: Request) -> Response:
        return AppResponse(ResponseContent(value=await request.json()))


def test_app_response() -> None:
    app = Starlette(routes=[Route("/", endpoint=AppEndpoint)])

    with TestClient(app) as client:
        payload = dict(
            string="string",
            number=3.141592,
            bool=True,
        )

        out = client.post("/", json=payload)
        assert out.json() == ResponseContent(value=payload).model_dump()
