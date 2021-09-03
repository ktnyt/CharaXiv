#!/bin/bash

EXPORT_METADATA="/firestore/firestore_export/firestore_export.overall_export_metadata"
START_COMMAND="/google-cloud-sdk/platform/cloud-firestore-emulator/cloud_firestore_emulator start --host=0.0.0.0 --port=$PORT"


trap 'kill $PID' SIGTERM

if [ -e $EXPORT_METADATA ]; then
    $START_COMMAND --seed_from_export=$EXPORT_METADATA &
else
    $START_COMMAND &
fi

PID=$!
wait $PID

curl -XPOST -H "Content-Type: application/json" -d "{\"database\": \"projects/$PROJECT_ID/databases/(default)\", \"export_directory\": \"/firestore\", \"export_name\": \"firestore_export\"}" "http://0.0.0.0:$PORT/emulator/v1/projects/$PROJECT_ID:export"

RC=$?
exit $RC
