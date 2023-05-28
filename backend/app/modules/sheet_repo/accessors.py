from uuid import uuid5

from django.db import transaction
from injector import Binder, InstanceProvider

from lib import id_token
from lib.patch import patch_dict
from src import sheet_pkg
from src.decorators import implements

from . import models


@implements(sheet_pkg.services.SheetListForSystemByUser)
def sheet_list_for_system_by_user(system: str, user_id: id_token.IDToken) -> sheet_pkg.types.SheetList:
    sheet_models = (models.Sheet.objects
                    .select_related('owner', 'system')
                    .prefetch_related('tag_set', 'image_set')
                    .filter(system__id=system, owner__id=user_id.to_uuid()))
    return sheet_pkg.types.SheetList(sheets=[sheet_model.to_domain() for sheet_model in sheet_models])


@implements(sheet_pkg.services.SheetWriteCheck)
def sheet_write_check(sheet_id: id_token.IDToken, user_id: id_token.IDToken) -> bool:
    return models.Sheet.objects.filter(id=sheet_id.to_uuid(), owner__id=user_id.to_uuid()).exists()


@implements(sheet_pkg.services.SheetCreateEmpty)
def sheet_create(user_id: id_token.IDToken, sheet_id: id_token.IDToken, system: str) -> None:
    models.Sheet.objects.create(
        id=sheet_id.to_uuid(),
        owner_id=user_id.to_uuid(),
        system_id=system,
    )


@implements(sheet_pkg.services.SheetGet)
def sheet_get(sheet_id: id_token.IDToken) -> sheet_pkg.types.Sheet:
    try:
        sheet_model = models.Sheet.objects.get(id=sheet_id.to_uuid())
        return sheet_model.to_domain()
    except models.Sheet.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetNotFound(sheet_id) from e


@implements(sheet_pkg.services.SheetUpdateContent)
def sheet_update_content(sheet_id: id_token.IDToken, content: sheet_pkg.types.Sheet.Content) -> None:
    try:
        with transaction.atomic():
            sheet_model = models.Sheet.objects.get(id=sheet_id.to_uuid())
            sheet_model.name = content.name
            sheet_model.data = content.data
            sheet_model.save()

            models.SheetTag.objects.filter(sheet=sheet_model).delete()
            sheet_model.tag_set.bulk_create([
                models.SheetTag(
                    id=uuid5(sheet_model.id, f'{index}:{tag}'),
                    sheet=sheet_model,
                    index=index,
                    value=tag,
                )
                for index, tag in enumerate(content.tags)
            ])
    except models.Sheet.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetNotFound(sheet_id) from e


@implements(sheet_pkg.services.SheetPatchContent)
def sheet_patch_content(sheet_id: id_token.IDToken, patch: sheet_pkg.types.Sheet.ContentPatch) -> None:
    try:
        with transaction.atomic():
            sheet_model = models.Sheet.objects.get(id=sheet_id.to_uuid())
            if patch.name is not None:
                sheet_model.name = patch.name
            if patch.data is not None:
                sheet_model.data = patch_dict(sheet_model.data, patch.data)
            sheet_model.save()

            if patch.tags is not None:
                models.SheetTag.objects.filter(sheet=sheet_model).delete()
                sheet_model.tag_set.bulk_create([
                    models.SheetTag(
                        id=uuid5(sheet_model.id, f'{index}:{tag}'),
                        sheet=sheet_model,
                        index=index,
                        value=tag,
                    )
                    for index, tag in enumerate(patch.tags)
                ])
    except models.Sheet.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetNotFound(sheet_id) from e


@implements(sheet_pkg.services.SheetCreateImage)
def sheet_create_image(sheet_id: id_token.IDToken, path: str) -> None:
    try:
        sheet_model = models.Sheet.objects.get(id=sheet_id.to_uuid())
        index = models.SheetImage.objects.filter(sheet_id=sheet_id.to_uuid()).count()
        models.SheetImage.objects.create(
            sheet=sheet_model,
            path=path,
            index=index,
        )
    except models.Sheet.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetNotFound(sheet_id) from e


@implements(sheet_pkg.services.SheetDeleteImage)
def sheet_delete_image(sheet_id: id_token.IDToken, path: str) -> None:
    try:
        with transaction.atomic():
            sheet_model = models.Sheet.objects.get(id=sheet_id.to_uuid())
            models.SheetImage.objects.get(sheet=sheet_model, path=path).delete()
            for index, image in enumerate(models.SheetImage.objects.filter(sheet=sheet_model).order_by('index')):
                image.index = index
                image.save()
            sheet_model.save()
    except models.Sheet.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetNotFound(sheet_id) from e
    except models.SheetImage.DoesNotExist as e:
        raise sheet_pkg.exceptions.SheetImageNotFound(sheet_id, path) from e


def configure(binder: Binder) -> None:
    binder.bind(sheet_pkg.services.SheetListForSystemByUser, to=InstanceProvider(sheet_list_for_system_by_user))
    binder.bind(sheet_pkg.services.SheetWriteCheck, to=InstanceProvider(sheet_write_check))
    binder.bind(sheet_pkg.services.SheetCreateEmpty, to=InstanceProvider(sheet_create))
    binder.bind(sheet_pkg.services.SheetGet, to=InstanceProvider(sheet_get))
    binder.bind(sheet_pkg.services.SheetUpdateContent, to=InstanceProvider(sheet_update_content))
    binder.bind(sheet_pkg.services.SheetPatchContent, to=InstanceProvider(sheet_patch_content))
    binder.bind(sheet_pkg.services.SheetCreateImage, to=InstanceProvider(sheet_create_image))
    binder.bind(sheet_pkg.services.SheetDeleteImage, to=InstanceProvider(sheet_delete_image))
