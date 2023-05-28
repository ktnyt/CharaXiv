from typing import TYPE_CHECKING

from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from injector import Injector
from pydantic import BaseModel

if TYPE_CHECKING:  # pragma: no cover
    EmailStr = str
    PasswordStr = str
else:
    from pydantic import EmailStr
    from lib.fields import PasswordStr

from app import configurator
from app.modules import auth_cmpt
from app.utils.decorators import handle_exception, handle_validation
from src import user_pkg

from .http import JsonResponse

if TYPE_CHECKING:  # pragma: no cover
    SingleItemList = list[str]
else:
    from pydantic import conlist
    SingleItemList = conlist(str, min_items=1, max_items=1)


class AuthenticatedView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        authenticated = Injector(configurator).get(auth_cmpt.protocols.Authenticated)
        return JsonResponse(authenticated(request))


class CheckUsernameParams(BaseModel):
    key: SingleItemList
    tag: SingleItemList


class UsernameTakenView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        params = CheckUsernameParams.parse_obj(request.GET)
        name = user_pkg.types.Name(key=params.key[0], tag=int(params.tag[0]))
        username_exists = Injector(configurator).get(user_pkg.services.UsernameExists)
        return JsonResponse(username_exists(name))


class LoginParameters(BaseModel):
    email: EmailStr
    password: PasswordStr


class LoginView(View):
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(auth_cmpt.exceptions.UnknownUserModel, status=500))
    @method_decorator(handle_exception(auth_cmpt.exceptions.LoginFailed, status=401))
    def post(self, request: HttpRequest) -> HttpResponse:
        params = LoginParameters.parse_raw(request.body)
        login = Injector(configurator).get(auth_cmpt.protocols.Login)
        user = login(request, params.email, params.password)
        return JsonResponse(user)


class LogoutView(View):
    @method_decorator(handle_exception(auth_cmpt.exceptions.UnknownUserModel, status=500))
    def post(self, request: HttpRequest) -> HttpResponse:
        logout = Injector(configurator).get(auth_cmpt.protocols.Logout)
        logout(request)
        return HttpResponse(status=204)


class RegisterParameters(BaseModel):
    email: EmailStr


@method_decorator(ensure_csrf_cookie, name='dispatch')
class RegisterView(View):
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(user_pkg.exceptions.UserWithEmailAlreadyExists, status=409))
    def post(self, request: HttpRequest) -> HttpResponse:
        params = RegisterParameters.parse_raw(request.body)
        register = Injector(configurator).get(user_pkg.services.Register)
        register(params.email)
        return HttpResponse(status=201)


class ActivateParameters(BaseModel):
    token: str
    username: user_pkg.types.Name
    password: PasswordStr


class ActivateView(View):
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(user_pkg.exceptions.RegistrationDoesNotExist, status=404))
    @method_decorator(handle_exception(user_pkg.exceptions.RegistrationExpired, status=410))
    def post(self, request: HttpRequest) -> HttpResponse:
        params = ActivateParameters.parse_raw(request.body)
        activate = Injector(configurator).get(user_pkg.services.Activate)
        activate(params.token, params.username, params.password)
        return HttpResponse(status=204)


class RequestPasswordResetParameters(BaseModel):
    email: EmailStr


class RequestPasswordResetView(View):
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(user_pkg.exceptions.UserWithEmailDoesNotExist, status=404))
    def post(self, request: HttpRequest) -> HttpResponse:
        params = RequestPasswordResetParameters.parse_raw(request.body)
        request_password_reset = Injector(configurator).get(user_pkg.services.RequestPasswordReset)
        request_password_reset(params.email)
        return HttpResponse(status=201)


class ResolvePasswordResetParameters(BaseModel):
    token: str
    password: str


class ResolvePasswordResetView(View):
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(user_pkg.exceptions.PasswordResetDoesNotExist, status=404))
    @method_decorator(handle_exception(user_pkg.exceptions.PasswordResetExpired, status=410))
    def post(self, request: HttpRequest) -> HttpResponse:
        params = ResolvePasswordResetParameters.parse_raw(request.body)
        resolve_password_reset = Injector(configurator).get(user_pkg.services.ResolvePasswordReset)
        resolve_password_reset(params.token, params.password)
        return HttpResponse(status=204)
