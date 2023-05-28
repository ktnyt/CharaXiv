import logging
from typing import Callable

from asgiref.local import Local
from django.conf import settings
from django.contrib import auth
from django.http import HttpRequest, HttpResponse

from app.modules import user_repo
from lib import id_token

log_context = Local()


class LogContextMiddleware:
    get_response: Callable[[HttpRequest], HttpResponse]
    generate: Callable[[], id_token.IDToken]

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse], generate: Callable[[], id_token.IDToken] = id_token.generate) -> None:
        self.get_response = get_response
        self.generate = generate

    def __call__(self, request: HttpRequest) -> HttpResponse:
        def get_request_id() -> id_token.IDToken:
            header_name = getattr(settings, 'REQUEST_ID_HEADER_NAME', 'HTTP_X_REQUEST_ID')
            header_token = request.META.get(header_name, None)
            if header_token is not None:
                return id_token.IDToken(header_token)
            return self.generate()

        def get_user_identifier() -> str | None:
            user_model = auth.get_user(request)
            if isinstance(user_model, user_repo.models.User):
                return str(user_model.to_domain().name)
            return None

        log_context.request_id = get_request_id()
        log_context.request_method = request.method
        log_context.request_path = request.path
        log_context.request_user = get_user_identifier()

        return self.get_response(request)


class LogContextFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        setattr(record, 'request_id', getattr(log_context, 'request_id', None))
        setattr(record, 'request_method', getattr(log_context, 'request_method', None))
        setattr(record, 'request_path', getattr(log_context, 'request_path', None))
        setattr(record, 'request_user', getattr(log_context, 'request_user', None))
        return True
