from io import BytesIO
from typing import BinaryIO

from injector import Binder, InstanceProvider
from PIL import Image

from src import image_pkg
from src.decorators import implements


@implements(image_pkg.services.ImageFromFile)
def image_from_file(file: BinaryIO) -> Image.Image:
    return Image.open(file)


@implements(image_pkg.services.ImageToBytes)
def image_to_bytes(image: Image.Image) -> bytes:
    buffer = BytesIO()
    image.save(buffer, image.format)
    buffer.seek(0)
    return buffer.getvalue()


@implements(image_pkg.services.ImageGetExtension)
def image_get_extension(image: Image.Image) -> str:
    format = image.format
    if format is None:
        raise ValueError('Image format is not set')
    return format.lower()


@implements(image_pkg.services.ImageResizeToFit)
def image_resize_to_fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    width, height = image.size
    if width <= max_width and height <= max_height:
        return image
    if width / height > max_width / max_height:
        width = max_width
        height = int(width / image.width * image.height)
    else:
        height = max_height
        width = int(height / image.height * image.width)
    return image.resize((width, height))


def configure(binder: Binder) -> None:
    binder.bind(image_pkg.services.ImageFromFile, to=InstanceProvider(image_from_file))
    binder.bind(image_pkg.services.ImageToBytes, to=InstanceProvider(image_to_bytes))
    binder.bind(image_pkg.services.ImageGetExtension, to=InstanceProvider(image_get_extension))
    binder.bind(image_pkg.services.ImageResizeToFit, to=InstanceProvider(image_resize_to_fit))
