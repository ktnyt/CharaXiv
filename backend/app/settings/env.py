import os

from injector import Injector

from src.config import Service

DJANGO_ENV = os.environ['DJANGO_ENV']
SECRET_KEY = os.environ['SECRET_KEY']
SERVICE_FQDN = Injector().get(Service).FQDN

POSTGRES_DB = os.environ['POSTGRES_DB']
POSTGRES_USER = os.environ['POSTGRES_USER']
POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']
POSTGRES_HOSTNAME = os.environ['POSTGRES_HOSTNAME']

SENTRY_DSN = os.environ['SENTRY_DSN']
