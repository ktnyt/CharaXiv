from unittest import mock

from faker import Faker
from mypy_boto3_s3 import S3Client

from app.modules import file_repo
from src import config


class TestFileSaveS3:
    def test_png(self) -> None:
        fake = Faker()
        path = fake.file_path(extension='png')
        content = fake.binary(length=100)

        aws_config = config.AWS()

        manager = mock.Mock()
        manager.client = mock.Mock(spec=S3Client)
        manager.client.put_object = mock.Mock()

        file_save_s3 = file_repo.accessors.FileSaveS3(
            client=manager.client,
            aws_config=aws_config,
        )

        file_save_s3(path=path, content=content)

        assert manager.mock_calls == [
            mock.call.client.put_object(
                Bucket=aws_config.S3_BUCKET_NAME,
                Key=path,
                Body=content,
                ContentType='image/png',
            ),
        ]

    def test_bytes(self) -> None:
        fake = Faker()
        path = fake.file_path(extension='')
        content = fake.binary(length=100)

        aws_config = config.AWS()

        manager = mock.Mock()
        manager.client = mock.Mock(spec=S3Client)
        manager.client.put_object = mock.Mock()

        file_save_s3 = file_repo.accessors.FileSaveS3(
            client=manager.client,
            aws_config=aws_config,
        )

        file_save_s3(path=path, content=content)

        assert manager.mock_calls == [
            mock.call.client.put_object(
                Bucket=aws_config.S3_BUCKET_NAME,
                Key=path,
                Body=content,
                ContentType='application/octet-stream',
            ),
        ]


def test_file_delete_s3() -> None:
    fake = Faker()
    path = fake.file_path()

    aws_config = config.AWS()

    manager = mock.Mock()
    manager.client = mock.Mock(spec=S3Client)
    manager.client.delete_object = mock.Mock()

    file_delete_s3 = file_repo.accessors.FileDeleteS3(
        client=manager.client,
        aws_config=aws_config,
    )

    file_delete_s3(path=path)

    assert manager.mock_calls == [
        mock.call.client.delete_object(
            Bucket=aws_config.S3_BUCKET_NAME,
            Key=path,
        ),
    ]
