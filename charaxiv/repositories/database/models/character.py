import typing
from uuid import UUID

import sqlalchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship

from charaxiv import types

from .base import Base
from .mixins import AutoIDMixin, TimestampMixin
from .user import User


class Character(Base, AutoIDMixin, TimestampMixin):
    __tablename__ = "characters"

    owner_id: Mapped[UUID] = mapped_column("owner_id", sqlalchemy.ForeignKey(User.id, ondelete="CASCADE"), sort_order=0)
    system: Mapped[types.system.System] = mapped_column("system", sqlalchemy.Enum(types.system.System), nullable=False, sort_order=1)
    name: Mapped[str] = mapped_column("name", sqlalchemy.String(255), nullable=False, sort_order=2)
    data: Mapped[bytes] = mapped_column("data", sqlalchemy.LargeBinary(), nullable=False, sort_order=3)

    tags: Mapped[typing.List["CharacterTag"]] = relationship(lazy="immediate")
    images: Mapped[typing.List["CharacterImage"]] = relationship(lazy="immediate")


class CharacterTag(Base):
    __tablename__ = "character_tags"

    character_id: Mapped[UUID] = mapped_column("character_id", sqlalchemy.ForeignKey(Character.id, ondelete="CASCADE"), primary_key=True, sort_order=0)
    value: Mapped[str] = mapped_column("value", sqlalchemy.String(255), primary_key=True, sort_order=1)
    index: Mapped[int] = mapped_column("index", sqlalchemy.Integer(), unique=True, nullable=False, sort_order=2)


class CharacterImage(Base, AutoIDMixin):
    __tablename__ = "character_images"
    __table_args__ = (
        sqlalchemy.UniqueConstraint("id", "character_id"),
    )

    character_id: Mapped[UUID] = mapped_column("character_id", sqlalchemy.ForeignKey(Character.id, ondelete="CASCADE"), sort_order=0)
    index: Mapped[int] = mapped_column("index", sqlalchemy.Integer(), unique=True, nullable=False, sort_order=1)
