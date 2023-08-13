from datetime import datetime, timedelta

from injector import singleton

from charaxiv import protocols


@singleton
class Adapter(protocols.datetime_diff_gt.Protocol):
    def __call__(self, t1: datetime, t2: datetime, dt: timedelta) -> bool:
        return max(t1 - t2, t2 - t1) > dt
