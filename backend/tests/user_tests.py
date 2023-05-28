import json
import logging
from unittest import mock

import pytest
from django.test import Client
from faker import Faker
from injector import Injector, InstanceProvider

from app import configurator
from app.modules import api_ctrl, mail_repo
from lib import secret_token
from src import config, core_pkg, factories, mail_pkg, user_pkg

logging.getLogger('injector').setLevel(logging.DEBUG)


@pytest.mark.django_db
def test_user_actions() -> None:
    fake = Faker()
    user = factories.fake_user(fake)
    password = fake.unique.password()

    registration_token = secret_token.generate()
    password_reset_token = secret_token.generate()

    manager = mock.Mock()
    manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret, side_effect=[
        registration_token,
        password_reset_token,
    ])
    manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID, side_effect=[user.id])
    manager.send_mail = mock.Mock(spec=mail_pkg.services.SendMail)

    with configurator.use(
        lambda binder: binder.bind(core_pkg.services.token.GenerateSecret, to=InstanceProvider(manager.generate_secret)),
        lambda binder: binder.bind(core_pkg.services.token.GenerateID, to=InstanceProvider(manager.generate_id)),
        lambda binder: binder.bind(mail_pkg.services.SendMail, to=InstanceProvider(manager.send_mail)),
    ):
        injector = Injector(configurator)
        service_config = injector.get(config.Service)
        client = Client()

        response = client.get(f'/api/user/name_taken?key={user.name.key}&tag={user.name.tag}')
        assert response.status_code == 200
        assert not json.loads(response.getvalue().decode())
        assert manager.mock_calls == []

        response = client.post(
            '/api/user/register',
            data=api_ctrl.user_views.RegisterParameters(email=user.email).dict(),
            content_type='application/json',
        )
        assert response.status_code == 201, response.getvalue().decode()
        assert manager.mock_calls == [
            mock.call.generate_secret(),
            mock.call.send_mail(mail_pkg.types.Mail(
                frm=service_config.NOREPLY_ADDRESS,
                to=[user.email],
                cc=[],
                bcc=[],
                content=mail_repo.accessors.registration_mail_template(service_config.FQDN, user.email, registration_token),
            )),
        ]
        manager.mock_calls.clear()

        response = client.post(
            '/api/user/activate',
            data=api_ctrl.user_views.ActivateParameters(
                token=registration_token,
                username=user.name,
                password=password,
            ).dict(),
            content_type='application/json',
        )
        assert response.status_code == 204
        assert manager.mock_calls == [
            mock.call.generate_id(),
        ]
        manager.mock_calls.clear()

        response = client.get(f'/api/user/name_taken?key={user.name.key}&tag={user.name.tag}')
        assert response.status_code == 200
        assert json.loads(response.getvalue().decode())
        assert manager.mock_calls == []

        response = client.post(
            '/api/user/login',
            data=api_ctrl.user_views.LoginParameters(email=user.email, password=password).dict(),
            content_type='application/json',
        )
        assert response.status_code == 200
        assert user_pkg.types.User.parse_raw(response.getvalue()) == user
        assert manager.mock_calls == []

        response = client.get('/api/user/authenticated')
        assert response.status_code == 200
        assert json.loads(response.getvalue())
        assert manager.mock_calls == []

        response = client.post('/api/user/logout')
        assert response.status_code == 204
        assert manager.mock_calls == []

        response = client.get('/api/user/authenticated')
        assert response.status_code == 200
        assert not json.loads(response.getvalue())
        assert manager.mock_calls == []

        response = client.post(
            '/api/user/password_reset/request',
            data=api_ctrl.user_views.RequestPasswordResetParameters(email=user.email).dict(),
            content_type='application/json',
        )
        assert response.status_code == 201
        assert manager.mock_calls == [
            mock.call.generate_secret(),
            mock.call.send_mail(mail_pkg.types.Mail(
                frm=service_config.NOREPLY_ADDRESS,
                to=[user.email],
                cc=[],
                bcc=[],
                content=mail_repo.accessors.password_reset_mail_template(service_config.FQDN, password_reset_token),
            )),
        ]
        manager.mock_calls.clear()

        new_password = fake.unique.password()

        response = client.post(
            '/api/user/password_reset/resolve',
            data=api_ctrl.user_views.ResolvePasswordResetParameters(token=password_reset_token, password=new_password).dict(),
            content_type='application/json',
        )
        assert response.status_code == 204
        assert manager.mock_calls == []

        response = client.post(
            '/api/user/login',
            data=api_ctrl.user_views.LoginParameters(email=user.email, password=new_password).dict(),
            content_type='application/json',
        )
        assert response.status_code == 200
        assert user_pkg.types.User.parse_raw(response.getvalue()) == user
        assert manager.mock_calls == []

        response = client.post('/api/user/logout')
        assert response.status_code == 204
        assert manager.mock_calls == []
