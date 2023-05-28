import logging
from typing import Callable
from unittest import mock

from django.contrib.sessions.backends import cache as engine
from django.http import HttpRequest, HttpResponse
from django.test import RequestFactory
from faker import Faker

from app.middleware.log_context import (LogContextFilter, LogContextMiddleware,
                                        log_context)
from app.modules import user_repo
from lib import id_token
from src import factories


def dummy_handler(request_id: id_token.IDToken) -> Callable[[HttpRequest], HttpResponse]:
    def handler(request: HttpRequest) -> HttpResponse:
        record = mock.Mock(spec=logging.LogRecord)

        filter = LogContextFilter()
        assert filter.filter(record)

        assert record.request_id == request_id
        assert record.request_id == log_context.request_id
        assert record.request_method == log_context.request_method
        assert record.request_path == log_context.request_path
        assert record.request_user == log_context.request_user

        return HttpResponse('Hello, World!')
    return handler


class TestLogContextMiddleware:
    def test_without_header__unauthorized(self) -> None:
        request_id = id_token.generate()
        mock_generate = mock.Mock(spec=id_token.generate, side_effect=[request_id])

        factory = RequestFactory()
        request = factory.get('/')

        store = engine.SessionStore()
        store.save()
        request.session = store

        handler = dummy_handler(request_id)
        middleware = LogContextMiddleware(handler, generate=mock_generate)

        response = middleware(request)

        assert response.status_code == 200
        assert response.content == b'Hello, World!'

        assert request.META.get('HTTP_X_REQUEST_ID') is None
        assert request.META.get('HTTP_X_REQUEST_USER') is None

        assert log_context.request_id == request_id
        assert log_context.request_method == 'GET'
        assert log_context.request_path == '/'
        assert log_context.request_user is None

    @mock.patch('django.contrib.auth.get_user')
    def test_without_header__authorized(self, get_user: mock.Mock) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        user_model = user_repo.models.User(
            id=user.id.to_uuid(),
            email=user.email,
            name_key=user.name.key,
            name_tag=user.name.tag,
        )

        get_user.side_effect = [user_model]

        request_id = id_token.generate()
        mock_generate = mock.Mock(spec=id_token.generate, side_effect=[request_id])

        factory = RequestFactory()
        request = factory.get('/')

        store = engine.SessionStore()
        store.save()
        request.session = store

        handler = dummy_handler(request_id)
        middleware = LogContextMiddleware(handler, generate=mock_generate)

        response = middleware(request)

        assert response.status_code == 200
        assert response.content == b'Hello, World!'

        assert request.META.get('HTTP_X_REQUEST_ID') is None
        assert request.META.get('HTTP_X_REQUEST_USER') is None

        assert log_context.request_id == request_id
        assert log_context.request_method == 'GET'
        assert log_context.request_path == '/'
        assert log_context.request_user == str(user.name)

    def test_with_header(self) -> None:
        request_id = id_token.generate()
        factory = RequestFactory()
        request = factory.get('/', HTTP_X_REQUEST_ID=request_id)

        store = engine.SessionStore()
        store.save()
        request.session = store

        handler = dummy_handler(id_token.IDToken(request_id))
        middleware = LogContextMiddleware(handler)

        response = middleware(request)

        assert response.status_code == 200
        assert response.content == b'Hello, World!'

        assert request.META.get('HTTP_X_REQUEST_ID') == request_id
        assert request.META.get('HTTP_X_REQUEST_USER') is None

        assert log_context.request_id == request_id
        assert log_context.request_method == 'GET'
        assert log_context.request_path == '/'
        assert log_context.request_user is None
