#!/bin/bash -eu

cd "$(cd "$(dirname "$0")/.."; pwd)" || exit 1

export PACKAGE_NAME=charaxiv
export STARLETTE_ENV=testing
export STARLETTE_KEY=starlette_key
export SQLITE_PATH=charaxiv_test.db

poetry run alembic upgrade head
poetry run python -m pytest -vv tests || true
rm $SQLITE_PATH
