from functools import wraps
from typing import Callable, ParamSpec, Protocol, Type, TypeVar

Params = ParamSpec('Params')
Return = TypeVar('Return', covariant=True)


class CallableProtocol(Protocol[Params, Return]):
    def __call__(self, *args: Params.args, **kwargs: Params.kwargs) -> Return: ...


T = TypeVar('T')


def implements(protocol: Type[CallableProtocol[Params, Return]]) -> Callable[[CallableProtocol[Params, Return]], CallableProtocol[Params, Return]]:
    def decorator(func: CallableProtocol[Params, Return]) -> CallableProtocol[Params, Return]:
        assert isinstance(func, protocol)

        @wraps(func)
        def wrapper(*args: Params.args, **kwargs: Params.kwargs) -> Return:
            return func(*args, **kwargs)
        return wrapper
    return decorator
