import typing

from starlette.datastructures import Headers
from starlette.responses import PlainTextResponse
from starlette.types import ASGIApp, Receive, Scope, Send


class SameOriginMiddleware:
    def __init__(self, app: ASGIApp, *, allow_origins: typing.Optional[typing.Sequence[str]] = None) -> None:
        self.app = app
        self.allow_all = allow_origins is None
        self.allow_origins = list(allow_origins or [])

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in (
            "http",
            "websocket",
        ) or self.allow_all:  # pragma: no cover
            await self.app(scope, receive, send)
            return

        if scope["method"] in ("GET", "HEAD"):
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        origin = headers.get("origin")
        if origin:
            for pattern in self.allow_origins:
                if origin == pattern or (
                    pattern.startswith("*") and origin.endswith(pattern[1:])
                ):
                    await self.app(scope, receive, send)
                    return

        response = PlainTextResponse("Forbidden", status_code=403)
        await response(scope, receive, send)
