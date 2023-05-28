from django.db import models

from app.modules.model import TimestampMixin


class System(models.Model, TimestampMixin):
    id = models.CharField(primary_key=True, max_length=255)
