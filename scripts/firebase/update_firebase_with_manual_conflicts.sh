#!/bin/bash

source "${BASH_SOURCE%/*}/../ensure.sh"

function update_firebase_with_manual_conflicts() {
    ensure::curl
    AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
    MANUAL_CHANGES_FILE_NAME=update_firebase_with_manual_conflicts.commit.firebase
    ACTION="PATCH"

    # We check if the file with the changes to upload to firebase exists
    if [ ! -f $MANUAL_CHANGES_FILE_NAME ]
    then
        echo "The file with the manual changes to upload to firebase does not exist"
        exit 0
    fi

    JSON_MANUAL_CHANGES=$(cat $MANUAL_CHANGES_FILE_NAME | sed '/^[[:space:]]*$/d')

    # We check if the file with the changes is not empty
    if [ ! -n "${JSON_MANUAL_CHANGES-unset}" ]
    then
        echo "There are no manual changes to upload to firebase"
        exit 0
    fi

    echo "Updating firebase with manually selected changes"
    curl -X $ACTION -d $JSON_MANUAL_CHANGES https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
    rm *.commit.firebase
}


