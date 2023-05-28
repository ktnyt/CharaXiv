from functools import wraps
from typing import Callable, ParamSpec, Protocol

from django.contrib import auth
from django.http import HttpRequest, HttpResponse
from pydantic import ValidationError

from app.modules import user_repo
from src import core_pkg, user_pkg

Params = ParamSpec('Params')


class ViewFunc(Protocol[Params]):
    def __call__(self, request: HttpRequest, *args: Params.args, **kwargs: Params.kwargs) -> HttpResponse: ...


def handle_validation(func: ViewFunc[Params]) -> ViewFunc[Params]:
    def wrapper(request: HttpRequest, *args: Params.args, **kwargs: Params.kwargs) -> HttpResponse:
        try:
            return func(request, *args, **kwargs)
        except ValidationError as error:
            return HttpResponse(error.json(), status=400, content_type='application/json')
    return wrapper


def handle_exception(exc_type: type[core_pkg.exceptions.CoreException], status: int) -> Callable[[ViewFunc[Params]], ViewFunc[Params]]:
    def decorator(func: ViewFunc[Params]) -> ViewFunc[Params]:
        def wrapper(request: HttpRequest, *args: Params.args, **kwargs: Params.kwargs) -> HttpResponse:
            try:
                return func(request, *args, **kwargs)
            except exc_type as e:
                return HttpResponse(e.msg, status=status)
        return wrapper
    return decorator


class AuthenticatedViewFunc(Protocol[Params]):
    def __call__(self, request: HttpRequest, *args: Params.args, user: user_pkg.types.User, **kwargs: Params.kwargs) -> HttpResponse: ...


def require_login(func: ViewFunc[Params]) -> ViewFunc[Params]:
    @wraps(func)
    def wrapper(request: HttpRequest, *args: Params.args, **kwargs: Params.kwargs) -> HttpResponse:
        user = kwargs.pop('user', None)
        if not isinstance(user, user_pkg.types.User):
            user_model = auth.get_user(request)
            if not isinstance(user_model, user_repo.models.User):
                return HttpResponse('Unauthorized', status=401)
            user = user_model.to_domain()
        kwargs['user'] = user
        return func(request, *args, **kwargs)
    return wrapper


def require_attachment(key: str) -> Callable[[ViewFunc[Params]], ViewFunc[Params]]:
    def decorator(func: ViewFunc[Params]) -> ViewFunc[Params]:
        @wraps(func)
        def wrapper(request: HttpRequest, *args: Params.args, **kwargs: Params.kwargs) -> HttpResponse:
            file = request.FILES.get(key)
            import logging
            logging.info(request.FILES)
            if file is None:
                return HttpResponse(f'Attachment "{key}" is required', status=400)
            kwargs[key] = file
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
