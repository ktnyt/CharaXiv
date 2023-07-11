import typing

import orjson
from starlette.responses import Response


class AppResponse(Response):
    media_type = "application/json"

    def render(self, content: typing.Any) -> bytes:
        return orjson.dumps(content)
