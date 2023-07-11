import enum
import os
import zoneinfo

from sqlalchemy.engine import url


class StarletteEnv(enum.StrEnum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"


STARLETTE_ENV = StarletteEnv(os.environ["STARLETTE_ENV"])
STARLETTE_KEY = os.environ["STARLETTE_KEY"]

DEBUG = STARLETTE_ENV in (StarletteEnv.DEVELOPMENT, StarletteEnv.TESTING)

TIMEZONE = zoneinfo.ZoneInfo("Asia/Tokyo")

CHARAXIV_HOST = os.environ.get("CHARAXIV_HOSTNAME", "localhost")
CHARAXIV_PORT = int(os.environ.get("CHARAXIV_PORT", "6640"))
CHARAXIV_SCHEME = os.environ.get("CHARAXIV_SCHEME", "http")
CHARAXIV_ORIGIN = f"{CHARAXIV_SCHEME}://{CHARAXIV_HOST}:{CHARAXIV_PORT}"

CHARAXIV_NOREPLY_EMAIL = os.environ.get("CHARAXIV_NOREPLY_EMIAIL", "noreply@charaxiv.app")

SQLITE_PATH = os.environ.get("SQLITE_PATH", "charaxiv.db")

DATABASE_URL = str(url.URL.create(
    drivername="sqlite+aiosqlite",
    database=SQLITE_PATH
))

SESSION_USERID_KEY = os.environ.get("SESSION_USERID_KEY", "_userid")

SENTRY_DSN = os.environ.get("SENTRY_DSN")
