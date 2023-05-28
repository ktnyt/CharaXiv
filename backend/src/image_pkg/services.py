from typing import BinaryIO, Protocol, runtime_checkable

from attr import dataclass
from injector import inject
from PIL import Image

from src import config


@runtime_checkable
class ImageFromFile(Protocol):
    def __call__(self, file: BinaryIO) -> Image.Image: ...


@runtime_checkable
class ImageToBytes(Protocol):
    def __call__(self, image: Image.Image) -> bytes: ...


@runtime_checkable
class ImageGetExtension(Protocol):
    def __call__(self, image: Image.Image) -> str: ...


@runtime_checkable
class ImageResizeToFit(Protocol):
    def __call__(self, image: Image.Image, max_width: int, max_height: int) -> Image.Image: ...


@inject
@dataclass
class ImageProcessForSheet:
    image_from_file: ImageFromFile
    image_resize_to_fit: ImageResizeToFit
    image_to_bytes: ImageToBytes
    image_get_extension: ImageGetExtension
    service_config: config.Service

    def __call__(self, file: BinaryIO) -> tuple[bytes, str]:
        image = self.image_from_file(file)
        image = self.image_resize_to_fit(image, self.service_config.SHEET_IMAGE_MAX_SIZE, self.service_config.SHEET_IMAGE_MAX_SIZE)
        return self.image_to_bytes(image), self.image_get_extension(image)
