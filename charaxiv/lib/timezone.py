from datetime import datetime

from charaxiv import settings


def now() -> datetime:
    return datetime.now(settings.TIMEZONE)


def aware(dt: datetime) -> datetime:
    return dt.astimezone(settings.TIMEZONE)
