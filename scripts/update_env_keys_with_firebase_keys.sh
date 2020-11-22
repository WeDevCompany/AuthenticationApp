#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"

function update_env_keys_with_firebase_keys() {
    FIREBASE_FILE_TEMP=firebase_env.temp.txt
    FIREBASE_KEY_TEMP=firebase_key.temp.txt
    ENV_FILE_TEMP=env.temp.txt
    ENV_KEY_TEMP=env_key.temp.txt

    # We download all the data from firebase and put it in a temporary file
    ensure::firebase_env

    # We get all the data from the .env and put it in a temporary file
    ensure::env

    # From the temporary file with the firebase data we generate a temporary file that only contains the keys
    sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $FIREBASE_KEY_TEMP

    # From the temporary file with the .env data we generate a temporary file that only contains the keys
    sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_KEY_TEMP

    # We compare the firebase keys not found in the .env
    ensure::diff_env $ENV_KEY_TEMP $FIREBASE_KEY_TEMP diff_key_env_to_firebase.temp.txt

    DIFF_KEY_ENV_TO_FIREBASE=$(cat diff_key_env_to_firebase.temp.txt)

    # If firebase contains keys that .env does not have, we insert the firebase keys in the .env
    if [ ! -z "$DIFF_KEY_ENV_TO_FIREBASE" ]
    then
        echo "The content of the .env does not correspond to that of firebase"
        echo "Updating .env to match content: "

        for line in $DIFF_KEY_ENV_TO_FIREBASE
        do
            LINE_VALUE=$(grep -w $line $FIREBASE_FILE_TEMP | cut -d '=' -f2)
            echo -e "${line}=${LINE_VALUE}"
            echo -e "${line}=${LINE_VALUE}" >> .env
        done
    fi

    rm *.temp.txt
}