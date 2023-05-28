#!/bin/bash -eu

apt install 

pip install --upgrade pip
pip install poetry 
poetry config virtualenvs.in-project false
poetry config virtualenvs.path /venv

poetry install
poetry run python manage.py migrate

"$@"
