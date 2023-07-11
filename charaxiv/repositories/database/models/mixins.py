import sys
from datetime import datetime
from uuid import UUID

import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column
from uuid6 import uuid7

from charaxiv.lib import timezone


class AutoIDMixin:
    id: Mapped[UUID] = mapped_column("id", sqlalchemy.Uuid(), primary_key=True, default=uuid7, sort_order=-1)

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}({self.id})>"  # pragma: no cover


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column("created_at", sqlalchemy.DateTime(timezone=False), nullable=False, default=timezone.now, sort_order=sys.maxsize-1)
    updated_at: Mapped[datetime] = mapped_column("updated_at", sqlalchemy.DateTime(timezone=False), nullable=False, default=timezone.now, onupdate=timezone.now, sort_order=sys.maxsize)
