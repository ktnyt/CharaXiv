import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from . import env


def init():
    sentry_sdk.init(
        dsn=env.SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        environment=env.DJANGO_ENV,
        send_default_pii=True,
    )
