from contextlib import AbstractContextManager

from django.db import transaction


def atomic() -> AbstractContextManager[None]:
    return transaction.atomic()  # pragma: no cover
