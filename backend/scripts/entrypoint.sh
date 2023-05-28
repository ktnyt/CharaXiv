#!/bin/bash -eu
poetry run python manage.py migrate

"$@"
