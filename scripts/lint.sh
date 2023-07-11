#!/bin/bash -eu

cd "$(cd "$(dirname "$0")/.."; pwd)" || exit 1
poetry run mypy charaxiv
poetry run flake8 charaxiv
