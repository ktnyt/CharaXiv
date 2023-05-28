import pytest
from django.contrib.auth import (BACKEND_SESSION_KEY, HASH_SESSION_KEY,
                                 SESSION_KEY)
from django.contrib.sessions.backends import cache as engine
from django.http import HttpRequest
from faker import Faker

from app.modules import user_repo
from src import factories

from . import accessors, exceptions


@pytest.mark.django_db
class TestAuthenticated:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        request = HttpRequest()
        store = engine.SessionStore()
        store.save()
        request.session = store

        user_repo.accessors.user_create(user, password)
        accessors.login(request, user.email, password)

        assert accessors.authenticated(request) is True

    def test_failed__no_user(self) -> None:
        request = HttpRequest()
        store = engine.SessionStore()
        store.save()
        request.session = store
        assert accessors.authenticated(request) is False


@pytest.mark.django_db
class TestLogin:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        request = HttpRequest()
        store = engine.SessionStore()
        store.save()
        request.session = store

        user_repo.accessors.user_create(user, password)

        assert accessors.login(request, user.email, password) == user

        assert SESSION_KEY in request.session
        assert HASH_SESSION_KEY in request.session
        assert BACKEND_SESSION_KEY in request.session

    def test_failed__wrong_password(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        request = HttpRequest()
        store = engine.SessionStore()
        store.save()
        request.session = store

        user_repo.accessors.user_create(user, password)

        with pytest.raises(exceptions.LoginFailed):
            accessors.login(request, user.email, password + 'x')

        assert SESSION_KEY not in request.session
        assert HASH_SESSION_KEY not in request.session
        assert BACKEND_SESSION_KEY not in request.session


@pytest.mark.django_db
class TestLogout:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        request = HttpRequest()
        store = engine.SessionStore()
        store.save()
        request.session = store

        user_repo.accessors.user_create(user, password)
        accessors.login(request, user.email, password)

        assert SESSION_KEY in request.session
        assert HASH_SESSION_KEY in request.session
        assert BACKEND_SESSION_KEY in request.session

        accessors.logout(request)

        assert SESSION_KEY not in request.session
        assert HASH_SESSION_KEY not in request.session
        assert BACKEND_SESSION_KEY not in request.session
