import pytest

from .patch import patch_dict


class TestPatchDict:
    def test_patch_dict__ok(self) -> None:
        assert patch_dict(dict(a=1, b=2), dict(a=3)) == dict(a=3, b=2)
        assert patch_dict(dict(a=dict(b=1)), dict(a=dict(b=2))) == dict(a=dict(b=2))

    def test_patch_dict__key_error(self) -> None:
        with pytest.raises(KeyError):
            patch_dict(dict(a=1), dict(b=2))

    def test_patch_dict__type_error(self) -> None:
        with pytest.raises(TypeError):
            patch_dict(dict(a=1), dict(a='2'))
