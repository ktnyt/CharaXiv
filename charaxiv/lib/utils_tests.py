import typing

import pytest

from charaxiv.lib import utils


@pytest.mark.parametrize("arg,exp", [
    (42, "42"),
    (None, None),
])
def test_maybe(arg: typing.Optional[int], exp: typing.Optional[str]) -> None:
    out = utils.maybe(arg, lambda v: f"{v}")
    assert out == exp
