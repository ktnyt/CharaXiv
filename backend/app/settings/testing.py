from .base import *  # noqa
from .database import *  # noqa

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'text': {
            'format': '%(asctime)s %(levelname)s %(name)s request=%(request_id)s method=%(request_method)s path=%(request_path)s user=%(request_user)s %(message)s',
            'datefmt': '%Y-%m-%dT%H:%M:%S%z',
        },
    },
    'filters': {
        'log_context': {
            '()': 'app.middleware.log_context.LogContextFilter',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'text',
            'filters': ['log_context'],
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
