import logging
from typing import Optional

from faker import Faker

from lib import id_token

from . import sheet_pkg, user_pkg

logging.getLogger('faker').setLevel(logging.ERROR)


def fake_name(fake: Faker) -> user_pkg.types.Name:
    return user_pkg.types.Name(
        key=fake.unique.name(),
        tag=fake.random.randint(0, 9999),
    )


def fake_user(fake: Faker, id: Optional[id_token.IDToken] = None, email: Optional[str] = None, name: Optional[user_pkg.types.Name] = None) -> user_pkg.types.User:
    return user_pkg.types.User(
        id=id or id_token.generate(),
        email=email or fake.unique.ascii_safe_email(),
        name=name or fake_name(fake),
    )


def fake_sheet_content(fake: Faker) -> sheet_pkg.types.Sheet.Content:
    return sheet_pkg.types.Sheet.Content(
        name=fake.unique.name(),
        tags=[fake.unique.word() for i in range(fake.random.randint(0, 3))],
        data={
            'string': fake.unique.word(),
            'number': fake.random.randint(0, 9999),
            'boolean': fake.random.choice([True, False]),
            'list': [fake.unique.word() for i in range(fake.random.randint(0, 3))],
            'dict': {
                'string': fake.unique.word(),
                'number': fake.random.randint(0, 9999),
                'boolean': fake.random.choice([True, False]),
                'list': [fake.unique.word() for i in range(fake.random.randint(0, 3))],
            },
            'date': fake.date(),
        },
    )


def fake_sheet(fake: Faker, system: str, owner_id: Optional[id_token.IDToken] = None) -> sheet_pkg.types.Sheet:
    return sheet_pkg.types.Sheet(
        id=id_token.generate(),
        system=system,
        owner=owner_id or id_token.generate(),
        content=fake_sheet_content(fake),
        images=[],
    )
