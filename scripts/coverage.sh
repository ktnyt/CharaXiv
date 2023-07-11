#!/bin/bash -eu

cd "$(cd "$(dirname "$0")/.."; pwd)" || exit 1

export STARLETTE_ENV=development
export STARLETTE_KEY=starlette_key
export SQLITE_PATH=:memory:

poetry run python -m pytest -vv --cov=. --cov-report=xml --ignore=tests || exit 1
poetry run coverage report -m --sort=miss