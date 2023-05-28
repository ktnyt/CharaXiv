from dataclasses import dataclass
from typing import BinaryIO, Protocol, runtime_checkable

from injector import inject

from lib import id_token
from src import core_pkg, file_pkg, image_pkg

from . import exceptions as sheet_exceptions
from . import types as sheet_types


@runtime_checkable
class SheetListForSystemByUser(Protocol):
    def __call__(self, system: str, user_id: id_token.IDToken) -> sheet_types.SheetList: ...


@runtime_checkable
class SheetWriteCheck(Protocol):
    def __call__(self, sheet_id: id_token.IDToken, user_id: id_token.IDToken) -> bool: ...


@runtime_checkable
class SheetCreateEmpty(Protocol):
    def __call__(self, user_id: id_token.IDToken, sheet_id: id_token.IDToken, system: str) -> None: ...


@runtime_checkable
class SheetGet(Protocol):
    def __call__(self, sheet_id: id_token.IDToken) -> sheet_types.Sheet: ...


@runtime_checkable
class SheetUpdateContent(Protocol):
    def __call__(self, sheet_id: id_token.IDToken, content: sheet_types.Sheet.Content) -> None: ...


@runtime_checkable
class SheetPatchContent(Protocol):
    def __call__(self, sheet_id: id_token.IDToken, patch: sheet_types.Sheet.ContentPatch) -> None: ...


@runtime_checkable
class SheetCreateImage(Protocol):
    def __call__(self, sheet_id: id_token.IDToken, path: str) -> None: ...


@runtime_checkable
class SheetDeleteImage(Protocol):
    def __call__(self, sheet_id: id_token.IDToken, path: str) -> None: ...


@inject
@dataclass
class SheetCreate:
    generate_id: core_pkg.services.token.GenerateID
    sheet_create_empty: SheetCreateEmpty

    def __call__(self, user_id: id_token.IDToken, system: str) -> id_token.IDToken:
        sheet_id = self.generate_id()
        self.sheet_create_empty(user_id, sheet_id, system)
        return sheet_id


@inject
@dataclass
class SheetUpdateContentWithOwnerCheck:
    sheet_write_check: SheetWriteCheck
    sheet_update_content: SheetUpdateContent

    def __call__(self, sheet_id: id_token.IDToken, content: sheet_types.Sheet.Content, user_id: id_token.IDToken) -> None:
        if not self.sheet_write_check(sheet_id, user_id):
            raise sheet_exceptions.SheetNotWritable(sheet_id)
        self.sheet_update_content(sheet_id, content)


@inject
@dataclass
class SheetPatchContentWithOwnerCheck:
    sheet_write_check: SheetWriteCheck
    sheet_patch_content: SheetPatchContent

    def __call__(self, sheet_id: id_token.IDToken, content: sheet_types.Sheet.ContentPatch, user_id: id_token.IDToken) -> None:
        if not self.sheet_write_check(sheet_id, user_id):
            raise sheet_exceptions.SheetNotWritable(sheet_id)
        self.sheet_patch_content(sheet_id, content)


@inject
@dataclass
class SheetAppendImage:
    sheet_write_check: SheetWriteCheck
    image_process_for_sheet: image_pkg.services.ImageProcessForSheet
    generate_id: core_pkg.services.token.GenerateID
    atomic_transaction: core_pkg.services.transaction.Atomic
    sheet_create_image: SheetCreateImage
    file_save: file_pkg.services.FileSave

    def __call__(self, sheet_id: id_token.IDToken, file: BinaryIO, user_id: id_token.IDToken) -> None:
        if not self.sheet_write_check(sheet_id, user_id):
            raise sheet_exceptions.SheetNotWritable(sheet_id)
        content, extension = self.image_process_for_sheet(file)
        path = f'media/{self.generate_id()}.{extension}'
        with self.atomic_transaction():
            self.sheet_create_image(sheet_id, path)
            self.file_save(path, content)


@inject
@dataclass
class SheetRemoveImage:
    sheet_write_check: SheetWriteCheck
    atomic_transaction: core_pkg.services.transaction.Atomic
    sheet_delete_image: SheetDeleteImage
    file_delete: file_pkg.services.FileDelete

    def __call__(self, sheet_id: id_token.IDToken, path: str, user_id: id_token.IDToken) -> None:
        if not self.sheet_write_check(sheet_id, user_id):
            raise sheet_exceptions.SheetNotWritable(sheet_id)
        with self.atomic_transaction():
            self.sheet_delete_image(sheet_id, path)
            self.file_delete(path)
