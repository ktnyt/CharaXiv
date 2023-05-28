from typing import Generator
from uuid import uuid5

import pytest
from faker import Faker
from pydantic import BaseModel

from app.modules import sheet_repo, system_repo, user_repo
from lib import id_token
from src import factories, sheet_pkg, user_pkg


class Database(BaseModel):
    user: user_pkg.types.User
    systems: list[str]
    sheets: list[sheet_pkg.types.Sheet]


@pytest.fixture(scope='function')
def db_fixture() -> Generator[Database, None, None]:
    fake = Faker()
    user = factories.fake_user(fake)
    password = fake.unique.password()
    systems = ['emoklore', 'coc6', 'coc7']
    sheets = [factories.fake_sheet(fake, system, user.id) for system in systems for _ in range(3)]

    user_model = user_repo.models.User.objects.create_user(
        user.id,
        user.email,
        user.name.key,
        user.name.tag,
        password,
    )

    system_models = {system: system_repo.models.System.objects.create(id=system) for system in systems}

    sheet_models = {
        sheet.id: sheet_repo.models.Sheet.objects.create(
            id=sheet.id.to_uuid(),
            owner=user_model,
            system=system_models[sheet.system],
            name=sheet.content.name,
            data=sheet.content.data,
        ) for sheet in sheets
    }

    sheet_repo.models.SheetTag.objects.bulk_create([
        sheet_repo.models.SheetTag(
            id=uuid5(sheet.id.to_uuid(), tag),
            sheet=sheet_models[sheet.id],
            index=index,
            value=tag,
        ) for sheet in sheets for index, tag in enumerate(sheet.content.tags)
    ])

    yield Database(user=user, systems=systems, sheets=sheets)

    sheet_repo.models.SheetTag.objects.all().delete()
    sheet_repo.models.SheetImage.objects.all().delete()
    sheet_repo.models.Sheet.objects.all().delete()
    system_repo.models.System.objects.all().delete()
    user_repo.models.User.objects.all().delete()


@pytest.mark.django_db
class TestSheetListForSystemByUser:
    def test_sheet_list_for_system_by_user(self, db_fixture: Database) -> None:
        sheet_list = sheet_repo.accessors.sheet_list_for_system_by_user(db_fixture.systems[0], db_fixture.user.id)
        assert sorted(sheet_list.sheets) == sorted([sheet for sheet in db_fixture.sheets if sheet.system == db_fixture.systems[0]])


@pytest.mark.django_db
class TestSheetWriteCheck:
    def test_sheet_write_check(self, db_fixture: Database) -> None:
        assert sheet_repo.accessors.sheet_write_check(db_fixture.sheets[0].id, db_fixture.user.id)
        assert not sheet_repo.accessors.sheet_write_check(db_fixture.sheets[0].id, id_token.generate())


@pytest.mark.django_db
class TestSheetCreate:
    def test_sheet_create(self, db_fixture: Database) -> None:
        sheet_id = id_token.generate()
        sheet_repo.accessors.sheet_create(db_fixture.user.id, sheet_id, db_fixture.systems[0])
        sheet = sheet_repo.models.Sheet.objects.get(id=sheet_id.to_uuid()).to_domain()
        sheet_list = sheet_repo.accessors.sheet_list_for_system_by_user(db_fixture.systems[0], db_fixture.user.id)
        assert sorted(sheet_list.sheets) == sorted([sheet] + [sheet for sheet in db_fixture.sheets if sheet.system == db_fixture.systems[0]])


@pytest.mark.django_db
class TestSheetGet:
    def test_sheet_get__success(self, db_fixture: Database) -> None:
        sheet = sheet_repo.accessors.sheet_get(db_fixture.sheets[0].id)
        assert sheet == db_fixture.sheets[0]

    def test_sheet_get__sheet_not_found(self) -> None:
        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_repo.accessors.sheet_get(id_token.generate())


@pytest.mark.django_db
class TestSheetUpdateContent:
    def test_sheet_update_content__success(self, db_fixture: Database) -> None:
        sheet = sheet_repo.accessors.sheet_get(db_fixture.sheets[0].id)
        assert sheet.content == db_fixture.sheets[0].content
        new_content = factories.fake_sheet_content(Faker())
        sheet_repo.accessors.sheet_update_content(db_fixture.sheets[0].id, new_content)
        sheet = sheet_repo.accessors.sheet_get(db_fixture.sheets[0].id)
        assert sheet.content == new_content

    def test_sheet_update_content__sheet_not_found(self) -> None:
        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_repo.accessors.sheet_update_content(id_token.generate(), factories.fake_sheet_content(Faker()))


@pytest.mark.django_db
class TestSheetPatchContent:
    @pytest.mark.parametrize('use_name', [False, True])
    @pytest.mark.parametrize('use_data', [False, True])
    @pytest.mark.parametrize('use_tags', [False, True])
    def test_sheet_patch_content__success(self, db_fixture: Database, use_name: bool, use_data: bool, use_tags: bool) -> None:
        if not use_name and not use_data and not use_tags:
            return
        sheet = sheet_repo.accessors.sheet_get(db_fixture.sheets[0].id)
        old_content = db_fixture.sheets[0].content
        assert sheet.content == old_content
        new_content = factories.fake_sheet_content(Faker())
        new_content.tags = db_fixture.sheets[0].content.tags + new_content.tags
        sheet_patch = sheet_pkg.types.Sheet.ContentPatch(
            name=new_content.name if use_name else None,
            data=new_content.data if use_data else None,
            tags=new_content.tags if use_tags else None,
        )
        sheet_repo.accessors.sheet_patch_content(db_fixture.sheets[0].id, sheet_patch)
        sheet = sheet_repo.accessors.sheet_get(db_fixture.sheets[0].id)
        assert sheet.content.name == (new_content.name if use_name else old_content.name)
        assert sheet.content.data == (new_content.data if use_data else old_content.data)
        assert sheet.content.tags == (new_content.tags if use_tags else old_content.tags)

    def test_sheet_patch_content__sheet_not_found(self) -> None:
        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_repo.accessors.sheet_patch_content(id_token.generate(), sheet_pkg.types.Sheet.ContentPatch(
                name=None,
                data=None,
                tags=None,
            ))


@pytest.mark.django_db
class TestSheetCreateImage:
    def test_sheet_create_image__success(self, db_fixture: Database) -> None:
        fake = Faker()
        paths = [fake.unique.file_path() for _ in range(3)]

        sheet_id = db_fixture.sheets[0].id

        for path in paths:
            sheet_repo.accessors.sheet_create_image(sheet_id, path)

        sheet_image_models = sheet_repo.models.SheetImage.objects.filter(sheet__id=sheet_id.to_uuid()).order_by('index')
        assert [
            (sheet_image_model.index, sheet_image_model.path)
            for sheet_image_model in sheet_image_models
        ] == [
            (index, path) for index, path in enumerate(paths)
        ]

    def test_sheet_create_image__sheet_not_found(self) -> None:
        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_repo.accessors.sheet_create_image(id_token.generate(), '')


@pytest.mark.django_db
class TestSheetDeleteImage:
    def test_sheet_delete_image__success(self, db_fixture: Database) -> None:
        fake = Faker()
        paths = [fake.unique.file_path() for _ in range(3)]

        sheet_id = db_fixture.sheets[0].id

        for path in paths:
            sheet_repo.accessors.sheet_create_image(sheet_id, path)

        sheet_repo.accessors.sheet_delete_image(sheet_id, paths[1])

        sheet_image_models = sheet_repo.models.SheetImage.objects.filter(sheet__id=sheet_id.to_uuid()).order_by('index')
        assert [
            (sheet_image_model.index, sheet_image_model.path)
            for sheet_image_model in sheet_image_models
        ] == [
            (0, paths[0]),
            (1, paths[2]),
        ]

    def test_sheet_delete_image__sheet_not_found(self) -> None:
        with pytest.raises(sheet_pkg.exceptions.SheetNotFound):
            sheet_repo.accessors.sheet_delete_image(id_token.generate(), '')

    def test_sheet_delete_image__sheet_image_not_found(self, db_fixture: Database) -> None:
        fake = Faker()
        with pytest.raises(sheet_pkg.exceptions.SheetImageNotFound):
            sheet_repo.accessors.sheet_delete_image(db_fixture.sheets[0].id, fake.unique.file_path())
