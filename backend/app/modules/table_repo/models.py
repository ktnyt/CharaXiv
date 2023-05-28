from django.db import models

from app.modules.model import TimestampMixin
from app.modules.sheet_repo.models import Sheet
from app.modules.system_repo.models import System
from app.modules.user_repo.models import User


class TableTag(models.Model, TimestampMixin):
    value = models.CharField(primary_key=True, max_length=255)


class Table(models.Model, TimestampMixin):
    id = models.BigIntegerField(primary_key=True)
    owner = models.ForeignKey(to=User, null=False, blank=False, on_delete=models.CASCADE)
    system = models.ForeignKey(to=System, null=False, blank=False, on_delete=models.PROTECT)
    sheets = models.ManyToManyField(to=Sheet, through='TableSheetRelation')
    name = models.CharField(max_length=255, null=False, blank=False)
    tags = models.ManyToManyField(to=TableTag, through='TableTagRelation')
    note = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(null=False, blank=False)
    updated_at = models.DateTimeField(null=False, blank=False)


class TableSheetRelation(models.Model, TimestampMixin):
    table = models.ForeignKey(to=Table, null=False, blank=False, on_delete=models.CASCADE)
    sheet = models.ForeignKey(to=Sheet, null=False, blank=False, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['table', 'sheet']


class TableTagRelation(models.Model, TimestampMixin):
    table = models.ForeignKey(to=Table, null=False, blank=False, on_delete=models.CASCADE)
    tag = models.ForeignKey(to=TableTag, null=False, blank=False, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['table', 'tag']
