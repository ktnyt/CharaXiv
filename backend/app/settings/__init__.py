from . import env

if env.DJANGO_ENV == 'production':
    from .production import *

elif env.DJANGO_ENV == 'development':
    from .development import *

elif env.DJANGO_ENV == 'testing':
    from .testing import *
