import logging
from io import BytesIO
from unittest import mock

import pytest
from django.test import Client
from faker import Faker
from injector import Injector, InstanceProvider
from mypy_boto3_s3 import S3Client
from PIL import Image

from app import configurator
from app.modules import api_ctrl, mail_repo, system_repo
from lib import id_token, secret_token
from src import config, core_pkg, factories, mail_pkg, sheet_pkg, user_pkg

logging.getLogger('injector').setLevel(logging.DEBUG)


@pytest.mark.django_db
def test_sheet_actions() -> None:
    system_repo.models.System.objects.create(id='emoklore')

    fake = Faker()
    user = factories.fake_user(fake)
    sheet = factories.fake_sheet(fake, 'emoklore', owner_id=user.id)
    password = fake.unique.password()

    image_id = id_token.generate()
    image_path = f'media/{image_id}.jpeg'

    registration_token = secret_token.generate()
    password_reset_token = secret_token.generate()

    manager = mock.Mock()
    manager.generate_secret = mock.Mock(spec=core_pkg.services.token.GenerateSecret, side_effect=[
        registration_token,
        password_reset_token,
    ])
    manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID, side_effect=[
        user.id,
        sheet.id,
        image_id,
    ])
    manager.send_mail = mock.Mock(spec=mail_pkg.services.SendMail)
    manager.s3client = mock.Mock(spec=S3Client)
    manager.s3client.put_object = mock.Mock()

    with configurator.use(
        lambda binder: binder.bind(core_pkg.services.token.GenerateSecret, to=InstanceProvider(manager.generate_secret)),
        lambda binder: binder.bind(core_pkg.services.token.GenerateID, to=InstanceProvider(manager.generate_id)),
        lambda binder: binder.bind(mail_pkg.services.SendMail, to=InstanceProvider(manager.send_mail)),
        lambda binder: binder.bind(S3Client, to=InstanceProvider(manager.s3client)),
    ):
        injector = Injector(configurator)
        service_config = injector.get(config.Service)
        aws_config = injector.get(config.AWS)
        client = Client()

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

        response = client.post(
            '/api/user/login',
            data=api_ctrl.user_views.LoginParameters(email=user.email, password=password).dict(),
            content_type='application/json',
        )
        assert response.status_code == 200
        assert user_pkg.types.User.parse_raw(response.getvalue()) == user
        assert manager.mock_calls == []

        response = client.post(
            '/api/sheet',
            data=api_ctrl.sheet_views.SheetCreateParameters(
                system=sheet.system,
            ).dict(),
            content_type='application/json',
        )
        assert response.status_code == 201
        assert manager.mock_calls == [
            mock.call.generate_id(),
        ]
        manager.mock_calls.clear()

        response = client.get(f'/api/sheet?system={sheet.system}')
        assert response.status_code == 200
        assert sheet_pkg.types.SheetList.parse_raw(response.getvalue()) == sheet_pkg.types.SheetList(
            sheets=[sheet_pkg.types.Sheet(
                id=sheet.id,
                owner=user.id,
                system=sheet.system,
                content=sheet_pkg.types.Sheet.Content(
                    name='',
                    data={},
                    tags=[],
                ),
                images=[],
            )],
        )
        assert manager.mock_calls == []

        response = client.put(
            f'/api/sheet/{sheet.id}',
            data=sheet_pkg.types.Sheet.Content(
                name=sheet.content.name,
                data=sheet.content.data,
                tags=sheet.content.tags,
            ).json(),
            content_type='application/json',
        )
        assert response.status_code == 204
        assert manager.mock_calls == []

        response = client.get(f'/api/sheet/{sheet.id}')
        assert response.status_code == 200
        assert sheet_pkg.types.Sheet.parse_raw(response.getvalue()) == sheet
        assert manager.mock_calls == []

        image = Image.new('RGB', (100, 100))
        buffer = BytesIO()
        image.save(buffer, format='JPEG')
        buffer.seek(0)
        response = client.post(
            f'/api/sheet/{sheet.id}/images',
            data={'image': buffer},
        )
        assert response.status_code == 201, response.getvalue().decode()
        assert manager.mock_calls == [
            mock.call.generate_id(),
            mock.call.s3client.put_object(
                Bucket=aws_config.S3_BUCKET_NAME,
                Key=image_path,
                Body=buffer.getvalue(),
                ContentType='image/jpeg',
            ),
        ]
        manager.mock_calls.clear()

        sheet.images.append(image_path)

        response = client.get(f'/api/sheet/{sheet.id}')
        assert response.status_code == 200
        assert sheet_pkg.types.Sheet.parse_raw(response.getvalue()) == sheet
        assert manager.mock_calls == []

        response = client.delete(
            f'/api/sheet/{sheet.id}/images',
            data=api_ctrl.sheet_views.SheetImageDeleteParameters(path=image_path).dict(),
            content_type='application/json',
        )
        assert response.status_code == 204
        assert manager.mock_calls == [
            mock.call.s3client.delete_object(
                Bucket=aws_config.S3_BUCKET_NAME,
                Key=image_path,
            ),
        ]
        manager.mock_calls.clear()

        sheet.images = []

        response = client.get(f'/api/sheet/{sheet.id}')
        assert response.status_code == 200
        assert sheet_pkg.types.Sheet.parse_raw(response.getvalue()) == sheet
        assert manager.mock_calls == []
