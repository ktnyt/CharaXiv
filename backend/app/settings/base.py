import os
from pathlib import Path

from . import env

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = env.SECRET_KEY

ALLOWED_HOSTS: list[str] = []

CSRF_TRUSTED_ORIGINS = [env.SERVICE_FQDN]
CSRF_HEADER_NAME = 'HTTP_X_XSRF_TOKEN'

REQUEST_ID_HEADER_NAME = 'HTTP_X_REQUEST_ID'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',

    'app.modules.core_cmpt.apps.CoreComponentConfig',
    'app.modules.auth_cmpt.apps.AuthComponentConfig',
    'app.modules.user_repo.apps.UserRepositoryConfig',
    'app.modules.system_repo.apps.SystemRepositoryConfig',
    'app.modules.sheet_repo.apps.SheetRepositoryConfig',
    'app.modules.api_ctrl.apps.APIControllerConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'app.middleware.log_context.LogContextMiddleware',
]

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ja-jp'
TIME_ZONE = 'Asia/Tokyo'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'user_repo.User'
AUTHENTICATION_BACKEND = ['django.contrib.auth.backends.ModelBackend']

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = 'static/'
