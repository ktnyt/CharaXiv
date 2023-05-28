from unittest import mock

from django.test import RequestFactory

from . import csrf_views


class TestCSRFTokenView:
    @mock.patch('django.middleware.csrf.get_token')
    def test__ok(self, get_token: mock.Mock) -> None:
        token = 'csrftoken'
        get_token.side_effect = [token]

        csrf_token_view = csrf_views.CSRFTokenView.as_view()

        request_factory = RequestFactory()
        request = request_factory.get('/api/csrf_token')
        response = csrf_token_view(request)

        assert response.status_code == 200
        assert response.getvalue() == token.encode()

        assert get_token.mock_calls == [mock.call(request)]
