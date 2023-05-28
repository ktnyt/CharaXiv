from django.contrib import admin

from . import models


@admin.register(models.System)
class SystemAdmin(admin.ModelAdmin):
    pass
