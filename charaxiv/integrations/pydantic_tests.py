import pytest
from pydantic import BaseModel, ValidationError, field_validator

from charaxiv import lib
from charaxiv.integrations.pydantic import PasswordValidator


class PasswordModel(BaseModel):
    password: str

    password_validate = field_validator('password')(PasswordValidator())


class TestPasswordField:
    def test_validator(self) -> None:
        validator = PasswordValidator()
        for _ in range(1000):
            password = lib.password.generate()
            assert validator(password) == password

    def test_validate__success(self) -> None:
        password = lib.password.generate()

        model = PasswordModel(password=password)
        assert model.password == password

    @pytest.mark.parametrize("password", [
        lib.password.generate(length=10),
        lib.password.generate(lower=False),
        lib.password.generate(upper=False),
        lib.password.generate(digit=False),
        lib.password.generate(symbol=False),
    ])
    def test_vaildate__failure(self, password: str) -> None:
        with pytest.raises(ValidationError):
            PasswordModel(password=password)
