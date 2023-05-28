#!/bin/bash -eu

cd "$(cd "$(dirname "$0")/.."; pwd)" || exit 1

export DJANGO_ENV=testing
poetry run python -m pytest -vv --cov=. --cov-report=xml --ignore=tests && poetry run coverage report -m --sort=miss
