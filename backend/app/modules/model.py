from django.db import models


class TimestampMixin:
    created_at = models.DateTimeField(null=False, auto_now_add=True)  # type: ignore
    updated_at = models.DateTimeField(null=False, auto_now=True)  # type: ignore
