FROM golang:1.16.7-buster

WORKDIR /app
COPY . /app

RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.27.3 \
    && go build -v -o /app/tmp/main .

CMD [ "/app/tmp/main" ]
