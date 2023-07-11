from unittest import mock

from injector import Binder, InstanceProvider
from sqlalchemy.ext.asyncio import AsyncSession


def configure_mocks(binder: Binder) -> None:
    binder.bind(AsyncSession, to=InstanceProvider(mock.Mock()))
