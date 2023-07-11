import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column

from charaxiv import types

from .base import Base
from .mixins import AutoIDMixin, TimestampMixin


class User(Base, AutoIDMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column("email", sqlalchemy.String(254), nullable=False, unique=True, index=True, sort_order=0)
    username: Mapped[str] = mapped_column("username", sqlalchemy.String(32), nullable=False, unique=True, index=True, sort_order=1)
    password: Mapped[str] = mapped_column("password", sqlalchemy.String(97), nullable=False, sort_order=2)
    group: Mapped[types.user.Group] = mapped_column("group", sqlalchemy.Enum(types.user.Group), nullable=False, default=types.user.Group.BASE, sort_order=3)

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}({self.id}, {self.username}, {self.email})>"  # pragma: no cover
