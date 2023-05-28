from unittest import mock

from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import HttpRequest, HttpResponse
from faker import Faker
from pydantic import BaseModel, ValidationError

from app.modules import user_repo
from src import core_pkg, factories

from .decorators import (handle_exception, handle_validation,
                         require_attachment, require_login)


class ExampleModel(BaseModel):
    value: int


class TestHandleValidation:
    def test_no_error(self) -> None:
        exp = HttpResponse('OK')
        func = mock.Mock(side_effect=[exp])

        wrapper = handle_validation(func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == exp.status_code
        assert response.getvalue() == exp.content
        assert func.mock_calls

    def test_has_error(self) -> None:
        try:
            ExampleModel.parse_raw(b'{"value": "a"}')

        except ValidationError as e:
            func = mock.Mock(side_effect=[e])

            wrapper = handle_validation(func)
            request = HttpRequest()
            response = wrapper(request)

            assert response.status_code == 400
            assert response.getvalue() == e.json().encode()
            assert func.mock_calls == [mock.call(request)]


class ExampleException(core_pkg.exceptions.CoreException):
    pass


class TestHandleException:
    def test_no_error(self) -> None:
        exp = HttpResponse('OK')
        func = mock.Mock(side_effect=[exp])

        wrapper = handle_validation(func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == exp.status_code
        assert response.getvalue() == exp.content
        assert func.mock_calls

    def test_has_error(self) -> None:
        func = mock.Mock(side_effect=[ExampleException('not found')])

        decorator = handle_exception(ExampleException, 404)
        wrapper = decorator(func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == 404
        assert response.getvalue() == b'not found'
        assert func.mock_calls


class TestRequireLogin:
    def test_user_given(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        exp = HttpResponse('OK')
        func = mock.Mock(side_effect=[exp])

        wrapper = require_login(func)
        request = HttpRequest()
        response = wrapper(request, user=user)

        assert response.status_code == exp.status_code
        assert response.getvalue() == exp.content
        assert func.mock_calls == [mock.call(request, user=user)]

    @mock.patch('app.utils.decorators.auth.get_user')
    def test_user_not_given(self, get_user: mock.Mock) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        user_model = user_repo.models.User(
            id=user.id.to_uuid(),
            email=user.email,
            name_key=user.name.key,
            name_tag=user.name.tag,
        )

        manager = mock.Mock()
        get_user.side_effect = [user_model]
        manager.attach_mock(get_user, 'get_user')

        exp = HttpResponse('OK')
        manager.func = mock.Mock(side_effect=[exp])

        wrapper = require_login(manager.func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == exp.status_code
        assert response.getvalue() == exp.content
        assert manager.mock_calls == [
            mock.call.get_user(request),
            mock.call.func(request, user=user),
        ]

    @mock.patch('app.utils.decorators.auth.get_user')
    def test_unauthorized(self, get_user: mock.Mock) -> None:
        get_user.side_effect = [None]
        func = mock.Mock(side_effect=[HttpResponse('OK')])

        wrapper = require_login(func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == 401
        assert response.getvalue() == b'Unauthorized'
        assert func.mock_calls == []


class TestRequireAttachment:
    def test_attachment__ok(self) -> None:
        fake = Faker()
        file = SimpleUploadedFile('test.txt', fake.paragraph().encode(), content_type='text/plain')
        exp = HttpResponse('OK')
        func = mock.Mock(side_effect=[exp])

        decorator = require_attachment('file')
        wrapper = decorator(func)
        request = HttpRequest()
        request.FILES['file'] = file
        response = wrapper(request)

        assert response.status_code == exp.status_code
        assert response.getvalue() == exp.content
        assert func.mock_calls == [mock.call(request, file=file)]

    def test_attachment__bad_request(self) -> None:
        exp = HttpResponse('OK')
        func = mock.Mock(side_effect=[exp])

        decorator = require_attachment('file')
        wrapper = decorator(func)
        request = HttpRequest()
        response = wrapper(request)

        assert response.status_code == 400, response.getvalue()
        assert func.mock_calls == []
