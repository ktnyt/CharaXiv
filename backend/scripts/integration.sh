#!/bin/bash -eu

cd "$(cd "$(dirname "$0")/.."; pwd)" || exit 1
export DJANGO_ENV=testing
poetry run python -m pytest -vv tests || true
