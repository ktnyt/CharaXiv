import pytest
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.status import HTTP_405_METHOD_NOT_ALLOWED
from starlette.testclient import TestClient

from charaxiv.application.endpoints.character_index import Endpoint


@pytest.mark.parametrize("method", ["get", "put", "patch", "delete"])
def test_character_index__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_character_index__post__201() -> None:
    pass
