import typing

T = typing.TypeVar("T")
U = typing.TypeVar("U")


def maybe(v: typing.Optional[T], f: typing.Callable[[T], U]) -> typing.Optional[U]:
    if v is None:
        return v
    return f(v)
