import contextlib
import typing
from unittest import mock
from urllib.parse import urlencode

import pytest
from argon2 import PasswordHasher
from injector import InstanceProvider
from starlette.applications import Starlette
from starlette.authentication import AuthCredentials, AuthenticationBackend
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.routing import Route
from starlette.status import HTTP_200_OK, HTTP_405_METHOD_NOT_ALLOWED
from starlette.testclient import TestClient
from uuid6 import uuid7

from charaxiv import combinators, constants, integrations, lib, types
from charaxiv.application.endpoints.character_index import (
    Endpoint, PostParams, ResponseCharacterSummary)
from charaxiv.application.response import ResponseContent


@pytest.mark.parametrize("method", ["put", "patch", "delete"])
def test_character_index__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_character_index__get__200(password_hasher: PasswordHasher) -> None:
    user_id = uuid7()
    email = "test@example.com"
    username = "username"
    password = password_hasher.hash(lib.password.generate())

    until_character_id = uuid7()
    until_character_id_token = lib.id_token.IDToken.from_uuid(until_character_id)
    character_summaries = [
        types.character.CharacterSummary(
            id=uuid7(),
            name=f"character{i}",
            tags=[f"tag{i}-{j}" for j in range(5)],
            images=[uuid7() for _ in range(5)],
        ) for i in range(10)
    ]

    manager = mock.Mock()
    manager.auth_backend = mock.Mock(spec=AuthenticationBackend)
    manager.auth_backend.authenticate = mock.AsyncMock(side_effect=[(
        AuthCredentials(types.user.Group.BASE.value),
        types.user.User(
            id=user_id,
            email=email,
            username=username,
            password=password,
            group=types.user.Group.BASE
        ),
    )])
    manager.character_list_for_user = mock.AsyncMock(spec=combinators.character_list_for_user.Combinator, side_effect=[character_summaries])

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.character_list_for_user.Combinator, to=InstanceProvider(manager.character_list_for_user))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[
            Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan),
            Middleware(AuthenticationMiddleware, backend=manager.auth_backend),
        ]
    )

    with TestClient(app) as client:
        out = client.get(f"?{urlencode(dict(until_character_id=until_character_id_token))}")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(
            value=dict(
                character_summaries=[
                    ResponseCharacterSummary(character_summary).model_dump()
                    for character_summary in character_summaries
                ],
            ),
        ).model_dump()
        assert manager.mock_calls == [
            mock.call.auth_backend.authenticate(mock.ANY),
            mock.call.character_list_for_user(
                user_id=user_id,
                until_character_id=until_character_id,
                limit=constants.CHARACTER_LIST_LIMIT_MAX,
            ),
        ]


def test_character_index__post__200(password_hasher: PasswordHasher) -> None:
    user_id = uuid7()
    email = "test@example.com"
    username = "username"
    password = password_hasher.hash(lib.password.generate())

    character_id = uuid7()
    character_id_token = lib.id_token.IDToken.from_uuid(character_id)

    manager = mock.Mock()
    manager.auth_backend = mock.Mock(spec=AuthenticationBackend)
    manager.auth_backend.authenticate = mock.AsyncMock(side_effect=[(
        AuthCredentials(types.user.Group.BASE.value),
        types.user.User(
            id=user_id,
            email=email,
            username=username,
            password=password,
            group=types.user.Group.BASE
        ),
    )])
    manager.character_create_new = mock.AsyncMock(spec=combinators.character_create_new.Combinator, side_effect=[character_id])

    @contextlib.asynccontextmanager
    async def request_lifespan() -> typing.AsyncGenerator[integrations.starlette.InstallableModuleType, None]:
        yield lambda binder: binder.bind(combinators.character_create_new.Combinator, to=InstanceProvider(manager.character_create_new))

    app = Starlette(
        routes=[Route("/", endpoint=Endpoint)],
        middleware=[
            Middleware(integrations.starlette.InjectorMiddleware, request_lifespan=request_lifespan),
            Middleware(AuthenticationMiddleware, backend=manager.auth_backend),
        ]
    )

    with TestClient(app) as client:
        params = PostParams(system=types.system.System.EMOKLORE, data=dict(), omit=[])
        out = client.post("/", json=params.model_dump())
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(value=dict(character_id=character_id_token)).model_dump()

    assert manager.mock_calls == [
        mock.call.auth_backend.authenticate(mock.ANY),
        mock.call.character_create_new(
            owner_id=user_id,
            system=types.system.System.EMOKLORE,
            data=dict(),
            omit=[],
        ),
    ]
