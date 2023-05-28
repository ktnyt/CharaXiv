import io
from unittest import mock

import pytest
from faker import Faker
from PIL import Image

from lib import id_token
from lib.mockutils import ContextManagerMock
from src import core_pkg, factories, file_pkg, image_pkg, sheet_pkg


class TestSheetUpdateContentWithOwnerCheck:
    def test_success(self) -> None:
        fake = Faker()
        sheet_content = factories.fake_sheet_content(fake)

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(side_effect=[True])
        manager.sheet_update_content = mock.Mock(spec=sheet_pkg.services.SheetUpdateContent)
        sheet_update_content_with_owner_check = sheet_pkg.services.SheetUpdateContentWithOwnerCheck(
            sheet_write_check=manager.sheet_write_check,
            sheet_update_content=manager.sheet_update_content,
        )

        sheet_update_content_with_owner_check(
            sheet_id,
            sheet_content,
            user_id,
        )

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
            mock.call.sheet_update_content(sheet_id, sheet_content),
        ]

    def test_failure__sheet_not_writable(self) -> None:
        fake = Faker()
        sheet_content = factories.fake_sheet_content(fake)

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(side_effect=[False])
        manager.sheet_update_content = mock.Mock(spec=sheet_pkg.services.SheetUpdateContent)
        sheet_update_content_with_owner_check = sheet_pkg.services.SheetUpdateContentWithOwnerCheck(
            sheet_write_check=manager.sheet_write_check,
            sheet_update_content=manager.sheet_update_content,
        )

        with pytest.raises(sheet_pkg.exceptions.SheetNotWritable):
            sheet_update_content_with_owner_check(
                sheet_id,
                sheet_content,
                user_id,
            )

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
        ]


class TestSheetPatchContentWithOwnerCheck:
    def test_success(self) -> None:
        fake = Faker()
        sheet_content = factories.fake_sheet_content(fake)
        sheet_patch = sheet_pkg.types.Sheet.ContentPatch(
            name=sheet_content.name,
            data=sheet_content.data,
            tags=sheet_content.tags,
        )

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(side_effect=[True])
        manager.sheet_patch_content = mock.Mock(spec=sheet_pkg.services.SheetPatchContent)
        sheet_patch_content_with_owner_check = sheet_pkg.services.SheetPatchContentWithOwnerCheck(
            sheet_write_check=manager.sheet_write_check,
            sheet_patch_content=manager.sheet_patch_content,
        )

        sheet_patch_content_with_owner_check(
            sheet_id,
            sheet_patch,
            user_id,
        )

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
            mock.call.sheet_patch_content(sheet_id, sheet_patch),
        ]

    def test_failure__sheet_not_writable(self) -> None:
        fake = Faker()
        sheet_content = factories.fake_sheet_content(fake)
        sheet_patch = sheet_pkg.types.Sheet.ContentPatch(
            name=sheet_content.name,
            data=sheet_content.data,
            tags=sheet_content.tags,
        )

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(side_effect=[False])
        manager.sheet_patch_content = mock.Mock(spec=sheet_pkg.services.SheetPatchContent)
        sheet_patch_content_with_owner_check = sheet_pkg.services.SheetPatchContentWithOwnerCheck(
            sheet_write_check=manager.sheet_write_check,
            sheet_patch_content=manager.sheet_patch_content,
        )

        with pytest.raises(sheet_pkg.exceptions.SheetNotWritable):
            sheet_patch_content_with_owner_check(
                sheet_id,
                sheet_patch,
                user_id,
            )

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
        ]

    def test_failure__sheet_not_found(self) -> None:
        fake = Faker()
        sheet_content = factories.fake_sheet_content(fake)
        sheet_patch = sheet_pkg.types.Sheet.ContentPatch(
            name=sheet_content.name,
            data=sheet_content.data,
            tags=sheet_content.tags,
        )

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(side_effect=[True])
        manager.sheet_patch_content = mock.Mock(side_effect=sheet_pkg.exceptions.SheetNotFound(sheet_id))
        sheet_patch_content_with_owner_check = sheet_pkg.services.SheetPatchContentWithOwnerCheck(
            sheet_write_check=manager.sheet_write_check,
            sheet_patch_content=manager.sheet_patch_content,
        )

        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_patch_content_with_owner_check(
                sheet_id,
                sheet_patch,
                user_id,
            )

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
            mock.call.sheet_patch_content(sheet_id, sheet_patch),
        ]


class TestSheetCreate:
    def test_success(self) -> None:
        system = 'system'

        user_id = id_token.generate()
        sheet_id = id_token.generate()

        manager = mock.Mock()
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID, side_effect=[sheet_id])
        manager.sheet_create_empty = mock.Mock(spec=sheet_pkg.services.SheetCreateEmpty)
        sheet_create = sheet_pkg.services.SheetCreate(
            generate_id=manager.generate_id,
            sheet_create_empty=manager.sheet_create_empty,
        )

        sheet_create(user_id, system)

        assert manager.mock_calls == [
            mock.call.generate_id(),
            mock.call.sheet_create_empty(user_id, sheet_id, system),
        ]


class TestSheetAddImage:
    def test_success(self) -> None:
        sheet_id = id_token.generate()
        user_id = id_token.generate()
        image_id = id_token.generate()

        file = io.BytesIO()
        image = Image.new('RGB', (28, 28))
        image.save(file, format='PNG')
        extension = 'png'
        filename = f'media/{image_id}.{extension}'
        data = file.read()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(spec=sheet_pkg.services.SheetWriteCheck, side_effect=[True])
        manager.image_process_for_sheet = mock.Mock(spec=image_pkg.services.ImageProcessForSheet, side_effect=[(data, extension)])
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID, side_effect=[image_id])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.sheet_create_image = mock.Mock(spec=sheet_pkg.services.SheetCreateImage)
        manager.file_save = mock.Mock(spec=file_pkg.services.FileSave)
        sheet_append_image = sheet_pkg.services.SheetAppendImage(
            sheet_write_check=manager.sheet_write_check,
            image_process_for_sheet=manager.image_process_for_sheet,
            generate_id=manager.generate_id,
            atomic_transaction=manager.atomic_transaction,
            sheet_create_image=manager.sheet_create_image,
            file_save=manager.file_save,
        )

        sheet_append_image(sheet_id, file, user_id)

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
            mock.call.image_process_for_sheet(file),
            mock.call.generate_id(),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.sheet_create_image(sheet_id, filename),
            mock.call.file_save(filename, data),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__sheet_not_writable(self) -> None:
        sheet_id = id_token.generate()
        user_id = id_token.generate()

        file = io.BytesIO()
        image = Image.new('RGB', (28, 28))
        image.save(file, format='PNG')

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(spec=sheet_pkg.services.SheetWriteCheck, side_effect=[False])
        manager.image_process_for_sheet = mock.Mock(spec=image_pkg.services.ImageProcessForSheet)
        manager.generate_id = mock.Mock(spec=core_pkg.services.token.GenerateID)
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.sheet_create_image = mock.Mock(spec=sheet_pkg.services.SheetCreateImage)
        manager.file_save = mock.Mock(spec=file_pkg.services.FileSave)
        sheet_append_image = sheet_pkg.services.SheetAppendImage(
            sheet_write_check=manager.sheet_write_check,
            image_process_for_sheet=manager.image_process_for_sheet,
            generate_id=manager.generate_id,
            atomic_transaction=manager.atomic_transaction,
            sheet_create_image=manager.sheet_create_image,
            file_save=manager.file_save,
        )

        with pytest.raises(sheet_pkg.exceptions.SheetNotWritable):
            sheet_append_image(sheet_id, file, user_id)

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
        ]


class TestSheetRemoveImage:
    def test_success(self) -> None:
        sheet_id = id_token.generate()
        user_id = id_token.generate()
        image_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(spec=sheet_pkg.services.SheetWriteCheck, side_effect=[True])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.sheet_delete_image = mock.Mock(spec=sheet_pkg.services.SheetDeleteImage)
        manager.file_delete = mock.Mock(spec=file_pkg.services.FileDelete)
        sheet_delete_image = sheet_pkg.services.SheetRemoveImage(
            sheet_write_check=manager.sheet_write_check,
            atomic_transaction=manager.atomic_transaction,
            sheet_delete_image=manager.sheet_delete_image,
            file_delete=manager.file_delete,
        )

        sheet_delete_image(sheet_id, image_id, user_id)

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
            mock.call.atomic_transaction(),
            mock.call.transaction.__enter__(),
            mock.call.sheet_delete_image(sheet_id, image_id),
            mock.call.file_delete(image_id),
            mock.call.transaction.__exit__(None, None, None),
        ]

    def test_failure__sheet_not_writable(self) -> None:
        sheet_id = id_token.generate()
        user_id = id_token.generate()
        image_id = id_token.generate()

        manager = mock.Mock()
        manager.sheet_write_check = mock.Mock(spec=sheet_pkg.services.SheetWriteCheck, side_effect=[False])
        manager.transaction = ContextManagerMock()
        manager.atomic_transaction = mock.Mock(spec=core_pkg.services.transaction.Atomic, side_effect=[manager.transaction])
        manager.sheet_delete_image = mock.Mock(spec=sheet_pkg.services.SheetDeleteImage)
        manager.file_delete = mock.Mock(spec=file_pkg.services.FileDelete)
        sheet_delete_image = sheet_pkg.services.SheetRemoveImage(
            sheet_write_check=manager.sheet_write_check,
            atomic_transaction=manager.atomic_transaction,
            sheet_delete_image=manager.sheet_delete_image,
            file_delete=manager.file_delete,
        )

        with pytest.raises(sheet_pkg.exceptions.SheetNotWritable):
            sheet_delete_image(sheet_id, image_id, user_id)

        assert manager.mock_calls == [
            mock.call.sheet_write_check(sheet_id, user_id),
        ]
