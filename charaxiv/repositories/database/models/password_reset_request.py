from uuid import UUID

import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import TimestampMixin
from .user import User


class PasswordResetRequest(Base, TimestampMixin):
    __tablename__ = "password_reset_requests"

    token: Mapped[str] = mapped_column("token", sqlalchemy.String(43), primary_key=True, sort_order=-1)
    user_id: Mapped[UUID] = mapped_column("user_id", sqlalchemy.ForeignKey(User.id, ondelete="CASCADE"), unique=True, sort_order=0)
