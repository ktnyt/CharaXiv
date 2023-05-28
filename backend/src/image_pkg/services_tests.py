from io import BytesIO
from unittest import mock

from PIL import Image

from src import config, image_pkg


class TestImageProcessForSheet:
    def test_success(self) -> None:
        image = Image.new('RGB', (100, 100))
        data = image.tobytes()
        file = BytesIO(data)
        extension = '.png'

        service_config = config.Service()

        manager = mock.Mock()
        manager.image_from_file = mock.Mock(spec=image_pkg.services.ImageFromFile, side_effect=[image])
        manager.image_resize_to_fit = mock.Mock(spec=image_pkg.services.ImageResizeToFit, side_effect=[image])
        manager.image_to_bytes = mock.Mock(spec=image_pkg.services.ImageToBytes, side_effect=[data])
        manager.image_get_extension = mock.Mock(spec=image_pkg.services.ImageGetExtension, side_effect=[extension])
        image_process_for_sheet = image_pkg.services.ImageProcessForSheet(
            image_from_file=manager.image_from_file,
            image_resize_to_fit=manager.image_resize_to_fit,
            image_get_extension=manager.image_get_extension,
            image_to_bytes=manager.image_to_bytes,
            service_config=service_config,
        )

        out = image_process_for_sheet(file)
        assert out == (data, extension)

        assert manager.mock_calls == [
            mock.call.image_from_file(file),
            mock.call.image_resize_to_fit(image, service_config.SHEET_IMAGE_MAX_SIZE, service_config.SHEET_IMAGE_MAX_SIZE),
            mock.call.image_to_bytes(image),
            mock.call.image_get_extension(image),
        ]
