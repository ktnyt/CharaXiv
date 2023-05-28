from django.contrib import auth
from django.http import HttpRequest
from injector import Binder, InstanceProvider

from app.modules import user_repo
from src import user_pkg
from src.decorators import implements

from . import exceptions, protocols


@implements(protocols.Authenticated)
def authenticated(request: HttpRequest) -> bool:
    user_model = auth.get_user(request)
    return isinstance(user_model, user_repo.models.User)


@implements(protocols.Login)
def login(request: HttpRequest, email: str, password: str) -> user_pkg.types.User:
    user_model = auth.authenticate(username=email, password=password)

    if user_model is None:
        raise exceptions.LoginFailed(email=email)

    if not isinstance(user_model, user_repo.models.User):
        # This should not happen.
        raise exceptions.UnknownUserModel(user_model)  # pragma: no cover

    auth.login(request, user=user_model)
    return user_model.to_domain()


@implements(protocols.Logout)
def logout(request: HttpRequest) -> None:
    auth.logout(request)


def configure(binder: Binder) -> None:
    binder.bind(protocols.Authenticated, to=InstanceProvider(authenticated))
    binder.bind(protocols.Login, to=InstanceProvider(login))
    binder.bind(protocols.Logout, to=InstanceProvider(logout))
