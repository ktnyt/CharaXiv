from datetime import datetime

from django.utils import timezone


def now() -> datetime:
    return timezone.now()  # pragma: no cover
