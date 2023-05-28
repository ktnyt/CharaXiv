from typing import Any, List

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

from app.modules.model import TimestampMixin
from lib import id_token
from src import user_pkg


class UserManager(BaseUserManager['User']):
    def create_user(self, id: id_token.IDToken, email: str, name_key: str, name_tag: int, password: str) -> 'User':
        user = self.model(
            id=id.to_uuid(),
            email=self.normalize_email(email),
            name_key=name_key,
            name_tag=name_tag,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, TimestampMixin):
    objects = UserManager()

    id = models.UUIDField(primary_key=True)
    email = models.EmailField(null=False, blank=False, unique=True)
    name_key = models.TextField(null=False, blank=False)
    name_tag = models.IntegerField(null=False, blank=False)

    is_superuser = models.BooleanField(default=False)

    def to_domain(self) -> user_pkg.types.User:
        return user_pkg.types.User(
            id=id_token.IDToken.from_uuid(self.id),
            email=self.email,
            name=user_pkg.types.Name(
                key=self.name_key,
                tag=self.name_tag,
            ),
        )

    @property
    def is_staff(self) -> bool:
        return self.is_superuser

    def has_perm(self, perm: str, obj: Any = None) -> bool:
        return self.is_superuser

    def has_perms(self, perm_list: List[str], obj: Any = None) -> bool:
        return self.is_superuser

    def has_module_perms(self, app_label: str) -> bool:
        return self.is_superuser

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        unique_together = ['name_key', 'name_tag']


class Registration(models.Model, TimestampMixin):
    email = models.EmailField(primary_key=True)
    token = models.CharField(unique=True, max_length=43, null=False, blank=False)
    registered_at = models.DateTimeField(null=False, blank=False)

    def to_domain(self) -> user_pkg.types.Registration:
        return user_pkg.types.Registration(
            email=self.email,
            registered_at=self.registered_at,
        )


class PasswordReset(models.Model, TimestampMixin):
    user = models.OneToOneField(to=User, primary_key=True, on_delete=models.CASCADE)
    token = models.CharField(unique=True, max_length=43, null=False, blank=False)
    requested_at = models.DateTimeField(null=False, blank=False)

    def to_domain(self) -> user_pkg.types.PasswordReset:
        return user_pkg.types.PasswordReset(
            user_id=id_token.IDToken.from_uuid(self.user.id),
            requested_at=self.requested_at,
        )
