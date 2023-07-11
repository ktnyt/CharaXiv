import functools
import typing
from dataclasses import dataclass
from unittest import mock

import pytest

from charaxiv.lib.decorators import method_decorator


def decorate(func: typing.Callable[..., typing.Any]) -> typing.Callable[..., typing.Any]:
    @functools.wraps(func)
    def wrapper(*args: typing.Any, **kwargs: typing.Any) -> typing.Any:
        return func(*args, **kwargs)
    return wrapper


@dataclass
class SyncDecorated:
    mockfunc: mock.Mock

    @method_decorator(decorate)
    def __call__(self) -> None:
        self.mockfunc()


def test_method_decorator__sync() -> None:
    manager = mock.Mock()

    decorated = SyncDecorated(manager)
    decorated()

    assert manager.mock_calls == [mock.call()]


@dataclass
class AsyncDecorated:
    mockfunc: mock.Mock

    @method_decorator(decorate)
    async def __call__(self) -> None:
        self.mockfunc()


@pytest.mark.asyncio
async def test_method_decorator__async() -> None:
    manager = mock.Mock()

    decorated = AsyncDecorated(manager)
    await decorated()

    assert manager.mock_calls == [mock.call()]
