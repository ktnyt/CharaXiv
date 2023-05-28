import mimetypes
from dataclasses import dataclass

import boto3
from injector import Binder, inject
from mypy_boto3_s3 import S3Client

from src import config, file_pkg


@inject
@dataclass
class FileSaveS3(file_pkg.services.FileSave):
    client: S3Client
    aws_config: config.AWS

    def __call__(self, path: str, content: bytes) -> None:
        content_type, _ = mimetypes.guess_type(path)
        if content_type is None:
            content_type = 'application/octet-stream'
        self.client.put_object(
            Bucket=self.aws_config.S3_BUCKET_NAME,
            Key=path,
            Body=content,
            ContentType=content_type,
        )


@inject
@dataclass
class FileDeleteS3(file_pkg.services.FileDelete):
    client: S3Client
    aws_config: config.AWS

    def __call__(self, path: str) -> None:
        self.client.delete_object(
            Bucket=self.aws_config.S3_BUCKET_NAME,
            Key=path,
        )


def s3client_provider(aws_config: config.AWS) -> S3Client:
    return boto3.client(
        service_name='s3',
        aws_access_key_id=aws_config.ACCESS_KEY_ID,
        aws_secret_access_key=aws_config.SECRET_ACCESS_KEY,
        region_name=aws_config.S3_REGION_NAME,
        endpoint_url=aws_config.S3_ENDPOINT_URL,
    )  # pragma: no cover


def configure(binder: Binder) -> None:
    binder.bind(S3Client, to=s3client_provider)
    binder.bind(file_pkg.services.FileSave, to=FileSaveS3)
    binder.bind(file_pkg.services.FileDelete, to=FileDeleteS3)
