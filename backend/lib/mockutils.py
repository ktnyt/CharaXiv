from contextlib import AbstractContextManager
from unittest import mock


class ContextManagerMock(mock.Mock):
    def __init__(self) -> None:
        super().__init__(spec=AbstractContextManager)
        self.__enter__ = mock.Mock()
        self.__exit__ = mock.Mock()
