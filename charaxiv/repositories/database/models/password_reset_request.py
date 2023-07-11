from uuid import UUID

import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import TimestampMixin


class PasswordResetRequest(Base, TimestampMixin):
    __tablename__ = "password_reset_requests"

    token: Mapped[str] = mapped_column("token", sqlalchemy.String(43), primary_key=True, sort_order=-1)
    userid: Mapped[UUID] = mapped_column("userid", sqlalchemy.ForeignKey("users.id"), unique=True, sort_order=0)
