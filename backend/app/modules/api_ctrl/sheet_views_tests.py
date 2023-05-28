from io import BytesIO
from typing import Any
from unittest import mock

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory
from faker import Faker
from PIL import Image

from app import configurator
from src import factories, sheet_pkg

from . import sheet_views as sheet_views


class TestSheetIndexView:
    def test_get__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)
        sheet_list = sheet_pkg.types.SheetList(
            sheets=[factories.fake_sheet(fake, system, user.id) for _ in range(3)]
        )

        manager = mock.Mock()
        manager.sheet_list_for_system_by_user = mock.Mock(spec=sheet_pkg.services.SheetListForSystemByUser, side_effect=[sheet_list])
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetListForSystemByUser, manager.sheet_list_for_system_by_user)):
            sheet_index_view = sheet_views.SheetIndexView.as_view()

            request_factory = RequestFactory()
            params = sheet_views.SheetListQueryParameters(system=[system])
            request = request_factory.get('/api/sheet', params.dict())
            response = sheet_index_view(request, user=user)

            assert response.status_code == 200, response.getvalue()
            assert sheet_pkg.types.SheetList.parse_raw(response.getvalue()) == sheet_list

            assert manager.sheet_list_for_system_by_user.mock_calls == [mock.call(system, user.id)]

    def test_post__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)

        sheet = factories.fake_sheet(fake, system, user.id)

        manager = mock.Mock()
        manager.sheet_create_with_id = mock.Mock(spec=sheet_pkg.services.SheetCreate, side_effect=[sheet.id])
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetCreate, manager.sheet_create_with_id)):
            sheet_index_view = sheet_views.SheetIndexView.as_view()

            request_factory = RequestFactory()
            params = sheet_views.SheetCreateParameters(system=system)
            request = request_factory.post('/api/sheet', params.dict(), content_type='application/json')
            response = sheet_index_view(request, user=user)

            content = response.getvalue()
            assert response.status_code == 201, content
            assert content.decode() == str(sheet.id)

            assert manager.sheet_create_with_id.mock_calls == [mock.call(user.id, system)]


class TestSheetItemView:
    def test_get__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        sheet = factories.fake_sheet(fake, system)

        manager = mock.Mock()
        manager.sheet_get = mock.Mock(spec=sheet_pkg.services.SheetGet, side_effect=[sheet])
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetGet, manager.sheet_get)):
            sheet_item_view = sheet_views.SheetItemView.as_view()

            request_factory = RequestFactory()
            request = request_factory.get(f'/api/sheet/{sheet.id}')
            response = sheet_item_view(request, sheet_id=sheet.id)

            content = response.getvalue()
            assert response.status_code == 200, content
            assert sheet_pkg.types.Sheet.parse_raw(content) == sheet

            assert manager.sheet_get.mock_calls == [mock.call(sheet.id)]

    def test_put__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)
        sheet = factories.fake_sheet(fake, system, user.id)
        sheet_content = sheet_pkg.types.Sheet.Content(
            name=sheet.content.name,
            data=sheet.content.data,
            tags=sheet.content.tags,
        )

        manager = mock.Mock()
        manager.sheet_update_content = mock.Mock(spec=sheet_pkg.services.SheetUpdateContentWithOwnerCheck, side_effect=[None])
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetUpdateContentWithOwnerCheck, manager.sheet_update_content)):
            sheet_item_view = sheet_views.SheetItemView.as_view()

            request_factory = RequestFactory()
            request = request_factory.put(f'/api/sheet/{sheet.id}', sheet_content.dict(), content_type='application/json')

            response = sheet_item_view(request, sheet.id, user=user)

            content = response.getvalue()
            assert response.status_code == 204, content

            assert manager.sheet_update_content.mock_calls == [mock.call(sheet.id, sheet_content, user.id)]

    def test_patch__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)
        sheet = factories.fake_sheet(fake, system, user.id)
        sheet_patch = sheet_pkg.types.Sheet.ContentPatch(
            name=sheet.content.name,
            data=sheet.content.data,
            tags=sheet.content.tags,
        )

        manager = mock.Mock()
        manager.sheet_patch_content = mock.Mock(spec=sheet_pkg.services.SheetPatchContentWithOwnerCheck, side_effect=[None])
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetPatchContentWithOwnerCheck, manager.sheet_patch_content)):
            sheet_item_view = sheet_views.SheetItemView.as_view()

            request_factory = RequestFactory()
            request = request_factory.patch(f'/api/sheet/{sheet.id}', sheet_patch.dict(), content_type='application/json')

            response = sheet_item_view(request, sheet.id, user=user)

            content = response.getvalue()
            assert response.status_code == 204, content

            assert manager.sheet_patch_content.mock_calls == [mock.call(sheet.id, sheet_patch, user.id)]


class BufferContentEq:
    def __init__(self, buffer: BytesIO) -> None:
        self.buffer = buffer

    def __eq__(self, other: Any) -> bool:
        if not isinstance(other, BytesIO):
            return False
        return self.buffer.getvalue() == other.getvalue()


class TestSheetImagesView:
    def test_post__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)
        sheet = factories.fake_sheet(fake, system, user.id)

        manager = mock.Mock()
        manager.sheet_append_image = mock.Mock(spec=sheet_pkg.services.SheetAppendImage)
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetAppendImage, manager.sheet_append_image)):
            sheet_images_view = sheet_views.SheetImagesView.as_view()

            request_factory = RequestFactory()
            image = Image.new('RGB', (256, 256))
            buffer = BytesIO()
            image.save(buffer, format='PNG')
            upload_file = SimpleUploadedFile('image.png', buffer.getvalue(), content_type='image/png')
            request = request_factory.post(f'/api/sheet/{str(sheet.id)}/images', {'image': upload_file})

            response = sheet_images_view(request, str(sheet.id), user=user)

            content = response.getvalue()
            assert response.status_code == 201, content

            assert manager.sheet_append_image.mock_calls == [mock.call(sheet.id, BufferContentEq(buffer), user.id)]

    def test_delete__ok(self) -> None:
        fake = Faker()
        system = 'emoklore'
        user = factories.fake_user(fake)
        sheet = factories.fake_sheet(fake, system, user.id)

        manager = mock.Mock()
        manager.sheet_remove_image = mock.Mock(spec=sheet_pkg.services.SheetRemoveImage)
        with configurator.use(lambda binder: binder.bind(sheet_pkg.services.SheetRemoveImage, manager.sheet_remove_image)):
            sheet_images_view = sheet_views.SheetImagesView.as_view()

            request_factory = RequestFactory()
            params = sheet_views.SheetImageDeleteParameters(path='image.png')
            request = request_factory.delete(f'/api/sheet/{str(sheet.id)}/images', params.dict(), content_type='application/json')

            response = sheet_images_view(request, str(sheet.id), user=user)

            content = response.getvalue()
            assert response.status_code == 204, content

            assert manager.sheet_remove_image.mock_calls == [mock.call(sheet.id, 'image.png', user.id)]
