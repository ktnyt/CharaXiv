import contextlib
import logging
import typing
from dataclasses import dataclass

import sentry_sdk
from argon2 import PasswordHasher
from injector import Binder, InstanceProvider, inject, singleton
from sqlalchemy.ext.asyncio import (AsyncSession, async_sessionmaker,
                                    create_async_engine)
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.types import ASGIApp
from uuid6 import uuid7

from charaxiv import bindings, integrations, lib, protocols, settings, types
from charaxiv.application.sessionauth import SessionAuthBackend

from .middleware.customheader import CustomHeaderMiddleware
from .middleware.sameorigin import SameOriginMiddleware
from .routing import routes


@singleton
@inject
@dataclass
class SendMock(protocols.mail_send.Protocol):
    logger: logging.Logger

    async def __call__(self, /, *, mail: types.mail.Mail) -> None:
        message = "\n".join([f"    {line}" for line in mail.content.message.splitlines()])
        self.logger.info(
            f"Mock mail send\n"
            f"  From:    {mail.frm}\n"
            f"  To:      {', '.join(mail.to)}\n"
            f"  CC:      {', '.join(mail.cc)}\n"
            f"  BCC:     {', '.join(mail.bcc)}\n"
            f"  Subject: {mail.content.subject}\n"
            f"  Content:\n{message}"
        )


def setup(*overrides: integrations.starlette.InstallableModuleType) -> Starlette:
    if not settings.DEBUG:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.STARLETTE_ENV.value,
            traces_sample_rate=1.0,
        )

    logger = logging.getLogger('charaxiv')
    logger.setLevel(logging.DEBUG)
    logger.addHandler(logging.StreamHandler())

    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    session_maker = async_sessionmaker(engine, expire_on_commit=False)

    @contextlib.asynccontextmanager
    async def lifespan(app: ASGIApp) -> typing.AsyncGenerator[None, None]:
        yield
        await engine.dispose()

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        async with session_maker() as session:
            def configure(binder: Binder) -> None:
                binder.bind(PasswordHasher, to=InstanceProvider(PasswordHasher(
                    time_cost=2,  # 2 iterations
                    memory_cost=19*1024,  # 19 * 1024 KiB = 19 MiB
                    parallelism=1,  # 1 thread
                )))
                binder.bind(logging.Logger, to=InstanceProvider(logger))
                binder.bind(AsyncSession, to=InstanceProvider(session))

                binder.bind(protocols.timezone_now.Protocol, to=InstanceProvider(lib.timezone.now))
                binder.bind(protocols.timezone_aware.Protocol, to=InstanceProvider(lib.timezone.aware))

                binder.bind(protocols.uuid_generate.Protocol, to=uuid7)
                if settings.STARLETTE_ENV == settings.StarletteEnv.DEVELOPMENT:
                    binder.bind(protocols.mail_send.Protocol, to=SendMock)

                binder.install(bindings.configure)
                for override in overrides:
                    binder.install(override)

            yield configure
            await session.close()

    return Starlette(
        debug=settings.DEBUG,
        routes=routes,
        middleware=[
            Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan),
            Middleware(CustomHeaderMiddleware, custom_header="X-CHARAXIV-CSRF-PROTECTION"),
            Middleware(TrustedHostMiddleware, allowed_hosts=[settings.CHARAXIV_HOST]),
            Middleware(SameOriginMiddleware, allow_origins=[settings.CHARAXIV_ORIGIN]),
            Middleware(CORSMiddleware, allow_origins=[settings.CHARAXIV_ORIGIN]),
            Middleware(SessionMiddleware, secret_key=settings.STARLETTE_KEY),
            Middleware(AuthenticationMiddleware, backend=SessionAuthBackend()),
        ] + ([
            Middleware(HTTPSRedirectMiddleware),
            Middleware(GZipMiddleware, minimum_size=500),
        ] if not settings.DEBUG else []),
        lifespan=lifespan,
    )


main = setup()
