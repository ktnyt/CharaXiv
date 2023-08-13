import typing

import orjson
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import Response
from starlette.status import HTTP_200_OK


class ResponseContent(BaseModel, arbitrary_types_allowed=True):
    error: typing.Optional[typing.Any]
    value: typing.Optional[typing.Any]

    def __init__(self, /, *, error: typing.Optional[typing.Any] = None, value: typing.Optional[typing.Any] = None) -> None:
        super().__init__(error=error, value=value)


class AppResponse(Response):
    media_type = "application/json"

    def __init__(
        self,
        content: ResponseContent,
        status_code: int = HTTP_200_OK,
        headers: typing.Optional[typing.Mapping[str, str]] = None,
        media_type: typing.Optional[str] = None,
        background: typing.Optional[BackgroundTask] = None,
    ) -> None:
        super().__init__(content.model_dump(), status_code, headers, media_type, background)

    def render(self, content: typing.Any) -> bytes:
        return orjson.dumps(content)
