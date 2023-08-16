import typing

from injector import InstanceProvider
from starlette.status import HTTP_200_OK
from starlette.testclient import TestClient

from charaxiv import combinators, lib, settings
from charaxiv.application import setup
from charaxiv.application.response import ResponseContent


class UserRegistrationMailSend:
    _data: typing.Optional[typing.Tuple[str, str]] = None

    async def __call__(self, /, *, email: str, token: str) -> None:
        self._data = (email, token)

    @property
    def data(self) -> typing.Tuple[str, str]:
        assert self._data is not None, "UserRegistrationMailSend not called"
        email, token = self._data
        self._data = None
        return email, token


class UserPasswordResetMailSend:
    _data: typing.Optional[typing.Tuple[str, str]] = None

    async def __call__(self, /, *, email: str, token: str) -> None:
        self._data = (email, token)

    @property
    def data(self) -> typing.Tuple[str, str]:
        assert self._data is not None, "UserRegistrationMailSend not called"
        email, token = self._data
        self._data = None
        return email, token


def test_user() -> None:
    user_registration_mail_send = UserRegistrationMailSend()
    user_password_reset_mail_send = UserPasswordResetMailSend()

    app = setup(
        lambda binder: binder.bind(combinators.user_registration_mail_send.Combinator, to=InstanceProvider(user_registration_mail_send)),
        lambda binder: binder.bind(combinators.user_password_reset_mail_send.Combinator, to=InstanceProvider(user_password_reset_mail_send)),
    )

    with TestClient(app, headers={
        "X-CHARAXIV-CSRF-PROTECTION": "1",
        "HOST": settings.CHARAXIV_HOST,
        "ORIGIN": settings.CHARAXIV_ORIGIN,
    }) as client:
        email = "test@example.com"
        out = client.post("/api/user", json=dict(email=email))
        assert out.status_code == HTTP_200_OK

        sent_email, token = user_registration_mail_send.data
        assert sent_email == email
        assert len(token) == 43

        username = "username"
        password = lib.password.generate()

        out = client.put("/api/user", json=dict(token=token, username=username, password=password))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.post("/api/session", json=dict(email=email, password=password))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.get("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(value=dict(authenticated=True)).model_dump()

        out = client.delete("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.get("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(value=dict(authenticated=False)).model_dump()

        out = client.post("/api/password_reset", json=dict(email=email))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        sent_email, token = user_password_reset_mail_send.data
        assert sent_email == email
        assert len(token) == 43

        new_password = lib.password.generate()
        out = client.put("/api/password_reset", json=dict(token=token, password=new_password))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.post("/api/session", json=dict(email=email, password=password))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(error="UserVerificationFailed").model_dump()

        out = client.post("/api/session", json=dict(email=email, password=new_password))
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.get("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(value=dict(authenticated=True)).model_dump()

        out = client.delete("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent().model_dump()

        out = client.get("/api/session")
        assert out.status_code == HTTP_200_OK
        assert out.json() == ResponseContent(value=dict(authenticated=False)).model_dump()
