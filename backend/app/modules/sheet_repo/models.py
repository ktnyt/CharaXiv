from __future__ import annotations

from django.db import models

from app.modules import system_repo, user_repo
from app.modules.model import TimestampMixin
from lib import id_token
from src import sheet_pkg


class Sheet(models.Model, TimestampMixin):
    id = models.UUIDField(primary_key=True)
    owner = models.ForeignKey(to=user_repo.models.User, null=False, blank=False, on_delete=models.CASCADE, related_name='user_sheets')
    system = models.ForeignKey(to=system_repo.models.System, null=False, blank=False, on_delete=models.PROTECT)
    name = models.CharField(max_length=255, null=False, blank=False)
    data = models.JSONField(null=False, blank=False, default=dict)

    tag_set: models.QuerySet[SheetTag]

    @property
    def tags(self) -> list[str]:
        return [tag.value for tag in self.tag_set.all().order_by('index')]

    @property
    def images(self) -> list[str]:
        return [image.path for image in self.image_set.all().order_by('index')]

    def to_domain(self) -> sheet_pkg.types.Sheet:
        return sheet_pkg.types.Sheet(
            id=id_token.IDToken.from_uuid(self.id),
            owner=id_token.IDToken.from_uuid(self.owner.id),
            system=self.system.id,
            content=sheet_pkg.types.Sheet.Content(
                name=self.name,
                tags=self.tags,
                data=self.data,
            ),
            images=self.images,
        )


class SheetTag(models.Model, TimestampMixin):
    id = models.UUIDField(primary_key=True)
    sheet = models.ForeignKey(to=Sheet, null=False, blank=False, on_delete=models.CASCADE, related_name='tag_set')
    index = models.SmallIntegerField(null=False, blank=False)
    value = models.CharField(max_length=255)

    class Meta:
        unique_together = [('sheet', 'value'), ('sheet', 'index')]


class SheetImage(models.Model, TimestampMixin):
    path = models.CharField(primary_key=True, max_length=255)
    sheet = models.ForeignKey(to=Sheet, null=False, blank=False, on_delete=models.PROTECT, related_name='image_set')
    index = models.SmallIntegerField(null=False, blank=False)

    class Meta:
        unique_together = [('sheet', 'index')]
