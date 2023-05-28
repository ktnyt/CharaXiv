FROM python:3.11.1-bullseye

WORKDIR /app
COPY backend/ /app/

RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry add daphne

ENTRYPOINT [ "scripts/entrypoint.sh" ]

CMD [ "poetry", "run", "daphne", "-b", "0.0.0.0", "-p", "8000", "app.asgi:application" ]
