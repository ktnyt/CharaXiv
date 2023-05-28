from datetime import datetime, timezone

import pytest
from faker import Faker

from lib import id_token, secret_token
from src import factories, user_pkg

from . import accessors as accessors
from .models import PasswordReset, Registration, User


@pytest.mark.django_db
class TestEmailExists:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        User.objects.create_user(
            id=user.id,
            email=user.email,
            name_key=user.name.key,
            name_tag=user.name.tag,
            password=password,
        )

        assert accessors.email_exists(user.email)

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)

        assert not accessors.email_exists(user.email)


@pytest.mark.django_db
class TestUsernameExists:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        User.objects.create_user(
            id=user.id,
            email=user.email,
            name_key=user.name.key,
            name_tag=user.name.tag,
            password=password,
        )

        assert accessors.username_exists(user.name)

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)

        assert not accessors.username_exists(user.name)


@pytest.mark.django_db
class TestEmailToID:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        User.objects.create_user(
            id=user.id,
            email=user.email,
            name_key=user.name.key,
            name_tag=user.name.tag,
            password=password,
        )

        assert accessors.email_to_id(user.email) == user.id

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)

        with pytest.raises(user_pkg.exceptions.UserWithEmailDoesNotExist):
            accessors.email_to_id(user.email)


@pytest.mark.django_db
class TestCreate:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        assert User.objects.filter(email=user.email).exists()

    def test_failure__user_with_email_already_exists(self) -> None:
        fake = Faker()
        older_user = factories.fake_user(fake)
        newer_user = factories.fake_user(fake, email=older_user.email)
        password = fake.unique.password()

        accessors.user_create(older_user, password)

        with pytest.raises(user_pkg.exceptions.UserWithEmailAlreadyExists):
            accessors.user_create(newer_user, password)

    def test_failure__user_with_username_already_exists(self) -> None:
        fake = Faker()
        older_user = factories.fake_user(fake)
        newer_user = factories.fake_user(fake, name=older_user.name)
        password = fake.unique.password()

        accessors.user_create(older_user, password)

        with pytest.raises(user_pkg.exceptions.UserWithNameAlreadyExists):
            accessors.user_create(newer_user, password)


@pytest.mark.django_db
class TestUpdateUsername:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        new_identifier = factories.fake_name(fake)
        accessors.username_update(user.id, new_identifier)

        assert User.objects.filter(name_key=new_identifier.key, name_tag=new_identifier.tag).exists()

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user_id = id_token.generate()

        with pytest.raises(user_pkg.exceptions.UserWithIDDoesNotExist):
            accessors.username_update(user_id, factories.fake_name(fake))

    def test_failure__user_with_username_already_exists(self) -> None:
        fake = Faker()
        user1 = factories.fake_user(fake)
        user2 = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user1, password)
        accessors.user_create(user2, password)

        with pytest.raises(user_pkg.exceptions.UserWithNameAlreadyExists):
            accessors.username_update(user1.id, user2.name)


@pytest.mark.django_db
class TestUpdatePassword:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        new_password = fake.unique.password()
        accessors.password_update(user.id, new_password)

        assert User.objects.get(email=user.email).check_password(new_password)

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user_id = id_token.generate()

        with pytest.raises(user_pkg.exceptions.UserWithIDDoesNotExist):
            accessors.password_update(user_id, fake.unique.password())


@pytest.mark.django_db
class TestUpsertRegistration:
    def test_success__create(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.registration_upsert(user.email, token, timestamp)

        registration_model = Registration.objects.get(token=token)
        assert registration_model.to_domain() == user_pkg.types.Registration(
            email=user.email,
            registered_at=timestamp,
        )

    def test_success__update(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.registration_upsert(user.email, token, timestamp)

        timestamp = datetime(year=2222, month=2, day=23, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.registration_upsert(user.email, token, timestamp)

        registration_model = Registration.objects.get(token=token)
        assert registration_model.to_domain() == user_pkg.types.Registration(
            email=user.email,
            registered_at=timestamp,
        )


@pytest.mark.django_db
class TestGetRegistration:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.registration_upsert(user.email, token, timestamp)

        assert accessors.registration_get(token) == user_pkg.types.Registration(
            email=user.email,
            registered_at=timestamp,
        )

    def test_failure__registration_does_not_exist(self) -> None:
        token = secret_token.generate()

        assert accessors.registration_get(token) is None


@pytest.mark.django_db
class TestDeleteRegistration:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.registration_upsert(user.email, token, timestamp)

        accessors.registration_delete(token)

        assert Registration.objects.filter(token=token).exists() is False

    def test_failure__registration_does_not_exist(self) -> None:
        token = secret_token.generate()

        with pytest.raises(user_pkg.exceptions.RegistrationDoesNotExist):
            accessors.registration_delete(token)


@pytest.mark.django_db
class TestUpsertPasswordReset:
    def test_success__create(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.password_reset_upsert(user.id, token, timestamp)

        password_reset_model = PasswordReset.objects.get(token=token)
        assert password_reset_model.to_domain() == user_pkg.types.PasswordReset(
            user_id=user.id,
            requested_at=timestamp,
        )

    def test_success__update(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.password_reset_upsert(user.id, token, timestamp)

        timestamp = datetime(year=2222, month=2, day=23, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.password_reset_upsert(user.id, token, timestamp)

        password_reset_model = PasswordReset.objects.get(token=token)
        assert password_reset_model.to_domain() == user_pkg.types.PasswordReset(
            user_id=user.id,
            requested_at=timestamp,
        )

    def test_failure__user_does_not_exist(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()

        with pytest.raises(user_pkg.exceptions.UserWithIDDoesNotExist):
            accessors.password_reset_upsert(user.id, token, timestamp)


@pytest.mark.django_db
class TestGetPasswordReset:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.password_reset_upsert(user.id, token, timestamp)

        assert accessors.password_reset_get(token) == user_pkg.types.PasswordReset(
            user_id=user.id,
            requested_at=timestamp,
        )

    def test_failure__password_reset_does_not_exist(self) -> None:
        token = secret_token.generate()

        with pytest.raises(user_pkg.exceptions.PasswordResetDoesNotExist):
            accessors.password_reset_get(token)


@pytest.mark.django_db
class TestDeletePasswordReset:
    def test_success(self) -> None:
        fake = Faker()
        user = factories.fake_user(fake)
        password = fake.unique.password()

        accessors.user_create(user, password)

        timestamp = datetime(year=2222, month=2, day=22, tzinfo=timezone.utc)
        token = secret_token.generate()
        accessors.password_reset_upsert(user.id, token, timestamp)

        accessors.password_reset_delete(token)

        assert PasswordReset.objects.filter(token=token).exists() is False

    def test_failure__password_reset_does_not_exist(self) -> None:
        token = secret_token.generate()

        with pytest.raises(user_pkg.exceptions.PasswordResetDoesNotExist):
            accessors.password_reset_delete(token)
