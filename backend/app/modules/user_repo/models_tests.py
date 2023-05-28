from app.modules.user_repo.models import User


class TestUser:
    def test_permissions(self) -> None:
        user = User(is_superuser=False)
        assert user.is_staff is False
        assert user.has_perm('perm') is False
        assert user.has_perms(['perm']) is False
        assert user.has_module_perms('app') is False
