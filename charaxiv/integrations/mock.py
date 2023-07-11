import typing

T = typing.TypeVar("T")


class TypeIs(typing.Generic[T]):  # pragma: no cover
    typ: typing.Type[T]

    def __init__(self, typ: typing.Type[T]) -> None:
        self.typ = typ

    def __eq__(self, other: typing.Any) -> bool:
        return type(other) == self.typ

    def __ne__(self, other: typing.Any) -> bool:
        return not self == other
