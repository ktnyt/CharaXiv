from starlette.datastructures import Headers
from starlette.responses import PlainTextResponse
from starlette.types import ASGIApp, Receive, Scope, Send


class CustomHeaderMiddleware:
    def __init__(self, app: ASGIApp, *, custom_header: str) -> None:
        self.app = app
        self.custom_header = custom_header.lower()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ("http", "websocket"):  # pragma: no cover
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        if self.custom_header not in headers:
            response = PlainTextResponse("Forbidden", status_code=403)
            await response(scope, receive, send)
            return
        await self.app(scope, receive, send)
