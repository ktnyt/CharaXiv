import contextlib
import typing
from json import JSONDecodeError

from injector import Binder, Injector, Module
from pydantic import BaseModel, ValidationError
from starlette.authentication import BaseUser
from starlette.requests import Request
from starlette.responses import PlainTextResponse, Response
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.types import ASGIApp, Receive, Scope, Send

UserType = typing.TypeVar("UserType")


class AppUser(BaseUser, typing.Generic[UserType]):
    obj: UserType
    _identity: typing.Callable[[UserType], str]
    _display_name: typing.Callable[[UserType], str]

    def __init__(self, user: UserType, /, *, identity: typing.Callable[[UserType], str], display_name: typing.Callable[[UserType], str]) -> None:
        self.obj = user
        self._identity = identity
        self._display_name = display_name

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def display_name(self) -> str:
        return self._display_name(self.obj)

    @property
    def identity(self) -> str:
        return self._identity(self.obj)


def default_validate_error_response(e: ValidationError) -> Response:
    return Response(status_code=400, content="Bad Request")


def validate_body(
        Model: type[BaseModel],
        custom_response: typing.Callable[[ValidationError], Response] = default_validate_error_response,
) -> typing.Callable[[typing.Callable[..., typing.Awaitable[Response]]], typing.Callable[..., typing.Awaitable[Response]]]:
    def decorator(func: typing.Callable[..., typing.Awaitable[Response]]) -> typing.Callable[..., typing.Awaitable[Response]]:
        async def wrapper(request: Request, *args: typing.Any, **kwargs: typing.Any) -> Response:
            try:
                raw_dict = await request.json()
                params = Model.model_validate(raw_dict)
            except JSONDecodeError:
                return PlainTextResponse("Bad Request", status_code=HTTP_400_BAD_REQUEST)
            except ValidationError as e:
                return custom_response(e)
            return await func(request, params, *args, **kwargs)
        return wrapper
    return decorator


def raises(
        exc_type: typing.Type[Exception],
        response: Response,
) -> typing.Callable[[typing.Callable[..., typing.Awaitable[Response]]], typing.Callable[..., typing.Awaitable[Response]]]:
    def decorator(func: typing.Callable[..., typing.Awaitable[Response]]) -> typing.Callable[..., typing.Awaitable[Response]]:
        async def wrapper(request: Request, *args: typing.Any, **kwargs: typing.Any) -> Response:
            try:
                return await func(request, *args, **kwargs)
            except exc_type:
                return response
        return wrapper
    return decorator


InstallableModuleType = typing.Union[typing.Callable[[Binder], None], Module, typing.Type[Module]]


@contextlib.asynccontextmanager
async def default_request_lifespan() -> typing.AsyncGenerator[InstallableModuleType, None]:  # pragma: no cover
    def noop(binder: Binder) -> None:
        pass
    yield noop


RequestLifespan = typing.Callable[[], contextlib.AbstractAsyncContextManager[InstallableModuleType]]


INJECTOR_KEY = "injector"


class InjectorMiddleware:
    def __init__(self, app: ASGIApp, request_lifespan: RequestLifespan = default_request_lifespan) -> None:
        self.app = app
        self.request_lifespan = request_lifespan

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":  # pragma: no cover
            await self.app(scope, receive, send)
            return

        async with self.request_lifespan() as configure:
            scope[INJECTOR_KEY] = Injector(configure)
            await self.app(scope, receive, send)


def use_injector(func: typing.Callable[..., typing.Awaitable[Response]]) -> typing.Callable[..., typing.Awaitable[Response]]:
    async def wrapper(request: Request, *args: typing.Any, **kwargs: typing.Any) -> Response:
        assert INJECTOR_KEY in request.scope, "InjectorMiddleware must be installed to access injector"
        injector = request.scope[INJECTOR_KEY]
        assert type(injector) is Injector
        return await func(request, injector, *args, **kwargs)
    return wrapper
