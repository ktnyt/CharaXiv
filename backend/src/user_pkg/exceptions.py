from lib import id_token
from src import core_pkg

from . import types


class UserWithIDDoesNotExist(core_pkg.exceptions.CoreException):
    def __init__(self, user_id: id_token.IDToken):
        super().__init__(f'user with id {user_id} does not exist')


class UserWithEmailDoesNotExist(core_pkg.exceptions.CoreException):
    def __init__(self, email: str):
        super().__init__(f'user with email {email} does not exist')


class UserWithEmailAlreadyExists(core_pkg.exceptions.CoreException):
    def __init__(self, email: str):
        super().__init__(f'user with email {email} already exists')


# Not used yet.
# class UserWithNameDoesNotExist(core_pkg.exceptions.CoreException):
#     def __init__(self, userid: types.Name):
#         super().__init__(f'user with identifier `{userid}`does not exist')


class UserWithNameAlreadyExists(core_pkg.exceptions.CoreException):
    def __init__(self, userid: types.Name):
        super().__init__(f'user with identifier `{userid}` already exists')


class RegistrationDoesNotExist(core_pkg.exceptions.CoreException):
    def __init__(self, token: str) -> None:
        super().__init__(f'registration for email {token} does not exist')


class RegistrationExpired(core_pkg.exceptions.CoreException):
    def __init__(self, token: str) -> None:
        super().__init__(f'registration for {token} has expired')


class PasswordResetDoesNotExist(core_pkg.exceptions.CoreException):
    def __init__(self, token: str) -> None:
        super().__init__(f'password reset request for email {token} does not exist')


class PasswordResetExpired(core_pkg.exceptions.CoreException):
    def __init__(self, token: str) -> None:
        super().__init__(f'password reset request for {token} has expired')
