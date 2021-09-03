FROM google/cloud-sdk:alpine

WORKDIR /firestore

RUN apk add --update --no-cache openjdk8 \
    && gcloud components update \
    && gcloud components install cloud-firestore-emulator beta --quiet

COPY ./start.sh /firestore/start.sh

CMD ["/bin/sh", "/firestore/start.sh"]
