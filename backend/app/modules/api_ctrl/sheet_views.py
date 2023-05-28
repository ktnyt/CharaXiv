import io
from typing import TYPE_CHECKING

from django.core.files.uploadedfile import UploadedFile
from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from injector import Injector
from pydantic import BaseModel

from app import configurator
from app.utils.decorators import (handle_exception, handle_validation,
                                  require_attachment, require_login)
from lib import id_token
from src import sheet_pkg, user_pkg

from .http import JsonResponse

if TYPE_CHECKING:  # pragma: no cover
    SingleItemList = list[str]
else:
    from pydantic import conlist
    SingleItemList = conlist(str, min_items=1, max_items=1)


class SheetListQueryParameters(BaseModel):
    system: SingleItemList


class SheetCreateParameters(BaseModel):
    system: str


@method_decorator(csrf_exempt, name='dispatch')
class SheetIndexView(View):
    @method_decorator(require_login)
    def get(self, request: HttpRequest, user: user_pkg.types.User) -> HttpResponse:
        params = SheetListQueryParameters.parse_obj(request.GET)
        sheet_list_for_system_by_user = Injector(configurator).get(sheet_pkg.services.SheetListForSystemByUser)
        sheet_list = sheet_list_for_system_by_user(params.system[0], user.id)
        return JsonResponse(sheet_list)

    @method_decorator(require_login)
    @method_decorator(handle_validation)
    def post(self, request: HttpRequest, user: user_pkg.types.User) -> HttpResponse:
        params = SheetCreateParameters.parse_raw(request.body)
        sheet_create_with_id = Injector(configurator).get(sheet_pkg.services.SheetCreate)
        sheet_id = sheet_create_with_id(user.id, params.system)
        return HttpResponse(sheet_id, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class SheetItemView(View):
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotFound, status=404))
    def get(self, request: HttpRequest, sheet_id: str) -> HttpResponse:
        sheet_get = Injector(configurator).get(sheet_pkg.services.SheetGet)
        sheet = sheet_get(id_token.IDToken(sheet_id))
        return JsonResponse(sheet)

    @method_decorator(require_login)
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotWritable, status=403))
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotFound, status=404))
    def put(self, request: HttpRequest, sheet_id: str, user: user_pkg.types.User) -> HttpResponse:
        params = sheet_pkg.types.Sheet.Content.parse_raw(request.body)
        sheet_update_content_with_owner_check = Injector(configurator).get(sheet_pkg.services.SheetUpdateContentWithOwnerCheck)
        sheet_update_content_with_owner_check(id_token.IDToken(sheet_id), params, user.id)
        return HttpResponse(status=204)

    @method_decorator(require_login)
    @method_decorator(handle_validation)
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotWritable, status=403))
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotFound, status=404))
    def patch(self, request: HttpRequest, sheet_id: str, user: user_pkg.types.User) -> HttpResponse:
        params = sheet_pkg.types.Sheet.ContentPatch.parse_raw(request.body)
        sheet_patch_content_with_owner_check = Injector(configurator).get(sheet_pkg.services.SheetPatchContentWithOwnerCheck)
        sheet_patch_content_with_owner_check(id_token.IDToken(sheet_id), params, user.id)
        return HttpResponse(status=204)


class SheetImageDeleteParameters(BaseModel):
    path: str


@method_decorator(csrf_exempt, name='dispatch')
class SheetImagesView(View):
    @method_decorator(require_login)
    @method_decorator(require_attachment('image'))
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotWritable, status=403))
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotFound, status=404))
    def post(self, request: HttpRequest, sheet_id: str, *, user: user_pkg.types.User, image: UploadedFile) -> HttpResponse:
        sheet_append_image = Injector(configurator).get(sheet_pkg.services.SheetAppendImage)
        buffer = io.BytesIO()
        for chunk in image.chunks():
            buffer.write(chunk)
        sheet_append_image(id_token.IDToken(sheet_id), buffer, user.id)
        return HttpResponse(status=201)

    @method_decorator(require_login)
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotWritable, status=403))
    @method_decorator(handle_exception(sheet_pkg.exceptions.SheetNotFound, status=404))
    def delete(self, request: HttpRequest, sheet_id: str, *, user: user_pkg.types.User) -> HttpResponse:
        params = SheetImageDeleteParameters.parse_raw(request.body)
        sheet_remove_image = Injector(configurator).get(sheet_pkg.services.SheetRemoveImage)
        sheet_remove_image(id_token.IDToken(sheet_id), params.path, user.id)
        return HttpResponse(status=204)
