import math
import typing

import orjson
import pytest
from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession

from charaxiv import adapters, constants, lib, types
from charaxiv.adapters.db_character_filter_by_owner import Adapter


@pytest.mark.asyncio
async def test_db_character_filter_by_owner(database_session: AsyncSession, password_hasher: PasswordHasher) -> None:
    user_ids = [await adapters.db_user_insert.Adapter(session=database_session)(
        email=f"user{i}@example.com",
        username=f"user{i}",
        password=password_hasher.hash(lib.password.generate()),
        group=types.user.Group.ADMIN,
    ) for i in range(3)]

    character_per_user = 42
    character_per_page = 10

    character_ids_by_user_id = {
        user_id: [
            await adapters.db_character_insert.Adapter(session=database_session)(
                owner_id=user_id,
                system=types.system.System.EMOKLORE,
                name=f"character{i}-{j}",
                data=orjson.dumps(dict(memo=f"memo: {i}, {j}")),
            )
            for j in range(character_per_user)
        ]
        for i, user_id in enumerate(user_ids)
    }

    character_tag_values_by_character_id = {
        character_id: [
            lib.password.generate()
            for _ in range(5)
        ]
        for user_id in user_ids
        for character_id in character_ids_by_user_id[user_id]
    }

    for character_id in character_tag_values_by_character_id:
        await adapters.db_character_tags_update.Adapter(session=database_session)(
            character_id=character_id,
            tags=character_tag_values_by_character_id[character_id],
        )

    character_image_ids_by_character_id = {
        character_id: [
            await adapters.db_character_image_insert.Adapter(session=database_session)(character_id)
            for _ in range(5)
        ]
        for user_id in user_ids
        for character_id in character_ids_by_user_id[user_id]
    }

    adapter = Adapter(session=database_session)

    for i, user_id in enumerate(user_ids):
        until_character_id = constants.UUID7_MAX
        for cid in character_ids_by_user_id[user_id]:
            assert cid < until_character_id

        character_summaries_all: typing.List[types.character.CharacterSummary] = []
        for j in range(math.ceil(character_per_user / character_per_page)):
            character_summaries = await adapter(
                owner_id=user_id,
                until_character_id=until_character_id,
                limit=character_per_page,
            )

            character_ids = [character_summary.id for character_summary in character_summaries]

            # Characters must be fetched in descending ID order.
            assert character_ids == sorted(character_ids, reverse=True), f"user: {i+1} character: {j+1}"

            # Characters must be a subset of characters owned by a user.
            assert set(character_ids) | set(character_ids_by_user_id[user_id]) == set(character_ids_by_user_id[user_id]), f"user: {i+1} character: {j+1}"

            # Check the number of characters returned
            assert len(character_summaries) == min(character_per_page, character_per_user - len(character_summaries_all)), f"user: {i+1} character: {j+1}"

            character_summaries_all.extend(character_summaries)

            # Check the number of fetched characters up to this point.
            assert len(character_summaries_all) == min(character_per_user, (j + 1) * character_per_page), f"user: {i+1} character: {j+1}"

            until_character_id = character_summaries_all[-1].id

        character_ids_out = [character_summary.id for character_summary in character_summaries_all]
        character_ids_exp = sorted(character_ids_by_user_id[user_id], reverse=True)
        assert character_ids_out == character_ids_exp, f"user: {i+1}"
        assert [
            character_summary.tags
            for character_summary in character_summaries_all
        ] == [
            character_tag_values_by_character_id[character_summary.id]
            for character_summary in character_summaries_all
        ]
        assert [
            character_summary.images
            for character_summary in character_summaries_all
        ] == [
            character_image_ids_by_character_id[character_summary.id]
            for character_summary in character_summaries_all
        ]
