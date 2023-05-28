from typing import TYPE_CHECKING

import pytest
from faker import Faker
from pydantic import BaseModel, ValidationError

if TYPE_CHECKING:  # pragma: no cover
    PasswordStr = str
else:
    from lib.fields import PasswordStr


class PasswordModel(BaseModel):
    password: PasswordStr


class TestPasswordField:
    fake = Faker()

    def test_validate__success(self) -> None:
        password = self.fake.unique.password()

        model = PasswordModel(password=password)
        assert model.password == password

    @pytest.mark.parametrize('password', [
        fake.unique.random_int(),
        fake.unique.password(length=9),
        fake.unique.password(lower_case=False),
        fake.unique.password(upper_case=False),
        fake.unique.password(digits=False),
        fake.unique.password(special_chars=False),
    ])
    def test_vaildate__failure(self, password: str) -> None:
        with pytest.raises(ValidationError):
            PasswordModel(password=password)
