from . import env

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env.POSTGRES_DB,
        'USER': env.POSTGRES_USER,
        'PASSWORD': env.POSTGRES_PASSWORD,
        'HOST': env.POSTGRES_HOSTNAME,
        'ATOMIC_REQUESTS': True,
    }
}
