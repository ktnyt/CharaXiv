import functools
import inspect
import typing


def apply_decorators(inner: typing.Callable[..., typing.Any], decorators: typing.Sequence[typing.Callable[..., typing.Callable[..., typing.Any]]]) -> typing.Callable[..., typing.Any]:
    if len(decorators) == 0:
        return inner
    decorate, rest = decorators[0], decorators[1:]
    return apply_decorators(decorate(inner), rest)


ClassType = typing.TypeVar("ClassType")


def method_decorator(*func_decorators: typing.Callable[..., typing.Callable[..., typing.Any]]) -> typing.Callable[..., typing.Callable[..., typing.Any]]:
    def decorator(func: typing.Callable[..., typing.Any]) -> typing.Callable[..., typing.Any]:
        if inspect.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(self: ClassType, *args: typing.Any, **kwargs: typing.Any) -> typing.Any:
                async def inner(*args: typing.Any, **kwargs: typing.Any) -> typing.Any:
                    return await func(self, *args, **kwargs)
                decorated = apply_decorators(inner, func_decorators)
                return await decorated(*args, **kwargs)
            return async_wrapper
        else:
            def sync_wrapper(self: ClassType, *args: typing.Any, **kwargs: typing.Any) -> typing.Any:
                def inner(*args: typing.Any, **kwargs: typing.Any) -> typing.Any:
                    return func(self, *args, **kwargs)
                decorated = apply_decorators(inner, func_decorators)
                return decorated(*args, **kwargs)
            return sync_wrapper
    return decorator
