import json
from unittest import mock

from django.test import RequestFactory
from faker import Faker
from injector import InstanceProvider

from app import configurator
from app.modules import auth_cmpt
from lib import secret_token
from src import factories, user_pkg

from . import user_views as user_views


class TestAuthenticatedView:
    def test__ok(self) -> None:
        auth_authenticated = mock.Mock(spec=auth_cmpt.protocols.Authenticated, side_effect=[True])
        with configurator.use(lambda binder: binder.bind(auth_cmpt.protocols.Authenticated, to=InstanceProvider(auth_authenticated))):
            authenticated_view = user_views.AuthenticatedView.as_view()

            request_factory = RequestFactory()
            request = request_factory.get('/api/authenticated')
            response = authenticated_view(request)

            assert response.status_code == 200
            assert json.loads(response.getvalue())

            assert auth_authenticated.mock_calls == [mock.call(mock.ANY)]


class TestCheckUsernameView:
    def test__ok(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)

        username_exists = mock.Mock(spec=user_pkg.services.UsernameExists, side_effect=[True])
        with configurator.use(lambda binder: binder.bind(user_pkg.services.UsernameExists, to=InstanceProvider(username_exists))):
            check_username_view = user_views.UsernameTakenView.as_view()

            request_factory = RequestFactory()
            request = request_factory.get('/api/user/check_name', user.name.dict())
            response = check_username_view(request)

            assert response.status_code == 200
            assert json.loads(response.getvalue())

            assert username_exists.mock_calls == [mock.call(user.name)]


class TestLoginView:
    def test__ok(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        auth_login = mock.Mock(spec=auth_cmpt.protocols.Login, side_effect=[user])
        with configurator.use(lambda binder: binder.bind(auth_cmpt.protocols.Login, to=InstanceProvider(auth_login))):
            login_view = user_views.LoginView.as_view()

            params = user_views.LoginParameters(email=user.email, password=password)
            request_factory = RequestFactory()
            request = request_factory.post('/api/user/login', params.json().encode(), content_type='application/json')
            response = login_view(request)

            assert response.status_code == 200
            assert user_pkg.types.User.parse_raw(response.getvalue()) == user

            assert auth_login.mock_calls == [mock.call(mock.ANY, user.email, password)]

    def test__bad_request(self) -> None:
        auth_login = mock.Mock(spec=auth_cmpt.protocols.Login)
        with configurator.use(lambda binder: binder.bind(auth_cmpt.protocols.Login, to=InstanceProvider(auth_login))):
            login_view = user_views.LoginView.as_view()

            request_factory = RequestFactory()
            request = request_factory.post('/api/user/login', {}, content_type='application/json')
            response = login_view(request)

            assert response.status_code == 400

            assert auth_login.mock_calls == []


class TestLogoutView:
    def test__ok(self) -> None:
        auth_logout = mock.Mock(spec=auth_cmpt.protocols.Logout)
        with configurator.use(lambda binder: binder.bind(auth_cmpt.protocols.Logout, to=InstanceProvider(auth_logout))):
            logout_view = user_views.LogoutView.as_view()

            request_factory = RequestFactory()
            request = request_factory.post('/api/user/logout')
            response = logout_view(request)

            assert response.status_code == 204

            assert auth_logout.mock_calls == [mock.call(request)]


class TestRegisterView:
    def test__ok(self) -> None:
        fake = Faker()
        email = fake.unique.ascii_safe_email()

        token = secret_token.generate()

        user_register = mock.Mock(spec=user_pkg.services.Register, side_effect=[token])
        with configurator.use(lambda binder: binder.bind(user_pkg.services.Register, to=InstanceProvider(user_register))):
            register_view = user_views.RegisterView.as_view()

            params = user_views.RegisterParameters(email=email)
            request_factory = RequestFactory()
            request = request_factory.post('/api/user/register', params.json().encode(), content_type='application/json')
            response = register_view(request)

            assert response.status_code == 201

            assert user_register.mock_calls == [mock.call(email)]


class TestActivateView:
    def test__ok(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        token = secret_token.generate()

        user_activate = mock.Mock(spec=user_pkg.services.Activate, side_effect=[None])
        with configurator.use(lambda binder: binder.bind(user_pkg.services.Activate, to=InstanceProvider(user_activate))):
            activate_view = user_views.ActivateView.as_view()

            params = user_views.ActivateParameters(
                token=token,
                username=user.name,
                password=password,
            )
            request_factory = RequestFactory()
            request = request_factory.post('/api/user/activate', params.json().encode(), content_type='application/json')
            response = activate_view(request)

            assert response.status_code == 204

            assert user_activate.mock_calls == [mock.call(token, user.name, password)]


class TestRequestPasswordResetView:
    def test__ok(self) -> None:
        fake = Faker()
        email = fake.unique.ascii_safe_email()

        token = secret_token.generate()

        request_password_reset = mock.Mock(spec=user_pkg.services.RequestPasswordReset, side_effect=[token])
        with configurator.use(lambda binder: binder.bind(user_pkg.services.RequestPasswordReset, to=InstanceProvider(request_password_reset))):
            request_password_reset_view = user_views.RequestPasswordResetView.as_view()

            params = user_views.RequestPasswordResetParameters(email=email)
            request_factory = RequestFactory()
            request = request_factory.post('/api/user/password_reset/request', params.json().encode(), content_type='application/json')
            response = request_password_reset_view(request)

            assert response.status_code == 201

            assert request_password_reset.mock_calls == [mock.call(email)]


class TestResolvePasswordResetView:
    def test__ok(self) -> None:
        fake = Faker()
        password = fake.unique.password()

        token = secret_token.generate()

        resolve_password_reset = mock.Mock(spec=user_pkg.services.ResolvePasswordReset, side_effect=[None])
        with configurator.use(lambda binder: binder.bind(user_pkg.services.ResolvePasswordReset, to=InstanceProvider(resolve_password_reset))):
            resolve_password_reset_view = user_views.ResolvePasswordResetView.as_view()

            params = user_views.ResolvePasswordResetParameters(token=token, password=password)
            request_factory = RequestFactory()
            request = request_factory.post('/api/user/password_reset/resolve', params.json().encode(), content_type='application/json')
            response = resolve_password_reset_view(request)

            assert response.status_code == 204

            assert resolve_password_reset.mock_calls == [mock.call(token, password)]
