from injector import Binder, InstanceProvider

from lib import id_token, secret_token
from src import core_pkg

from . import timezone, transaction

__all__ = [
    'timezone',
    'transaction',
]


def configure(binder: Binder) -> None:
    binder.bind(core_pkg.services.timezone.Now, to=InstanceProvider(timezone.now))
    binder.bind(core_pkg.services.transaction.Atomic, to=InstanceProvider(transaction.atomic))
    binder.bind(core_pkg.services.token.GenerateSecret, to=InstanceProvider(secret_token.generate))
    binder.bind(core_pkg.services.token.GenerateID, to=InstanceProvider(id_token.generate))
