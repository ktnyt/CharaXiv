import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import TimestampMixin


class Registration(Base, TimestampMixin):
    __tablename__ = "registrations"

    token: Mapped[str] = mapped_column("token", sqlalchemy.String(43), primary_key=True, sort_order=-1)
    email: Mapped[str] = mapped_column("email", sqlalchemy.String(254), nullable=False, unique=True, index=True, sort_order=0)
