FROM python:3.11.1-bullseye

RUN apt-get update && apt-get install -y sqlite3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip && pip install poetry 
