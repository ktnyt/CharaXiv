from io import BytesIO

import pytest
from PIL import Image

from app.modules import image_repo


def test_image_file_io() -> None:
    in_image = Image.new('RGB', (100, 100))
    buffer = BytesIO()
    in_image.save(buffer, 'PNG')
    buffer.seek(0)

    out_image = image_repo.accessors.image_from_file(buffer)

    assert in_image.size == out_image.size
    assert in_image.tobytes() == out_image.tobytes()

    out_data = image_repo.accessors.image_to_bytes(out_image)
    assert out_data == buffer.getvalue()


class TestImageGetExtension:
    def test_success(self) -> None:
        image = Image.new('RGB', (100, 100))
        buffer = BytesIO()
        image.save(buffer, 'PNG')
        buffer.seek(0)

        assert image_repo.accessors.image_get_extension(Image.open(buffer)) == 'png'

    def test_failure(self) -> None:
        image = Image.new('RGB', (100, 100))
        with pytest.raises(ValueError):
            image_repo.accessors.image_get_extension(image)


class TestImageResizeToFit:
    def test_no_resize(self) -> None:
        image = Image.new('RGB', (100, 100))
        assert image_repo.accessors.image_resize_to_fit(image, 200, 200) == image

    def test_fit_width(self) -> None:
        image = Image.new('RGB', (100, 100))
        assert image_repo.accessors.image_resize_to_fit(image, 50, 200).size == (50, 50)

    def test_fit_height(self) -> None:
        image = Image.new('RGB', (100, 100))
        assert image_repo.accessors.image_resize_to_fit(image, 200, 50).size == (50, 50)
