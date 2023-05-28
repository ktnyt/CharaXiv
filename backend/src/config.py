import os


class Service:
    FQDN = os.environ['SERVICE_FQDN']
    NOREPLY_ADDRESS = os.environ['SERVICE_NOREPLY_ADDRESS']

    SHEET_IMAGE_MAX_SIZE = int(os.environ['SHEET_IMAGE_MAX_SIZE'])


class AWS:
    ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    S3_REGION_NAME = os.environ['AWS_S3_REGION_NAME']
    S3_ENDPOINT_URL = os.environ['AWS_S3_ENDPOINT_URL']
    S3_BUCKET_NAME = os.environ['AWS_S3_BUCKET_NAME']
    SES_REGION_NAME = os.environ['AWS_SES_REGION_NAME']
    SES_ENDPOINT_URL = os.environ['AWS_SES_ENDPOINT_URL']
