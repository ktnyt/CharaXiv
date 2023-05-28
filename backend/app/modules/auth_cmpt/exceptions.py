from django.db import models

from src import core_pkg


class LoginFailed(core_pkg.exceptions.CoreException):
    def __init__(self, email: str):
        super().__init__(f'login failed for user with email {email}')


class UnknownUserModel(core_pkg.exceptions.CoreException):
    def __init__(self, model: models.Model):
        super().__init__(f'unknown user model from authenticate: {model}')  # pragma: no cover
