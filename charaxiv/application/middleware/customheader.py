import typing

from starlette.datastructures import Headers
from starlette.responses import PlainTextResponse
from starlette.types import ASGIApp, Receive, Scope, Send

from charaxiv import lib


class CustomHeaderMiddleware:
    def __init__(self, app: ASGIApp, *, custom_header: typing.Optional[str]) -> None:
        self.app = app
        self.custom_header = lib.utils.maybe(custom_header, lambda s: s.lower())

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ("http", "websocket"):  # pragma: no cover
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        if self.custom_header is not None and self.custom_header not in headers:
            print(self.custom_header, headers)
            response = PlainTextResponse("Forbidden", status_code=403)
            await response(scope, receive, send)
            return
        await self.app(scope, receive, send)
