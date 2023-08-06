#!/bin/bash -eu

poetry config virtualenvs.in-project false
poetry config virtualenvs.path /venv

poetry install

poetry run alembic upgrade head

"$@"
