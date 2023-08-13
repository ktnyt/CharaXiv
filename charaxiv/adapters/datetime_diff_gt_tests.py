from datetime import timedelta

from charaxiv import lib
from charaxiv.adapters.datetime_diff_gt import Adapter


def test_datetime_diff_gt() -> None:
    t1 = lib.timezone.now()
    t2 = t1 + timedelta(seconds=1, microseconds=1)

    datetime_diff_gt = Adapter()

    assert datetime_diff_gt(t1, t2, timedelta(seconds=1))
    assert datetime_diff_gt(t2, t1, timedelta(seconds=1))
    assert not datetime_diff_gt(t1, t2, timedelta(seconds=1, microseconds=1))
    assert not datetime_diff_gt(t2, t1, timedelta(seconds=1, microseconds=1))
