#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"

function update_firebase_keys_with_env_keys() {
    ensure::curl
    FIREBASE_FILE_TEMP=firebase_env.temp.txt
    FIREBASE_KEY_TEMP=firebase_key.temp.txt
    ENV_FILE_TEMP=env.temp.txt
    ENV_KEY_TEMP=env_key.temp.txt
    AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
    ACTION="PATCH"

    # We download all the data from firebase and put it in a temporary file
    ensure::firebase_env

    # We get all the data from the .env and put it in a temporary file
    ensure::env

    # From the temporary file with the firebase data we generate a temporary file that only contains the keys
    sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $FIREBASE_KEY_TEMP

    # From the temporary file with the .env data we generate a temporary file that only contains the keys
    sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_KEY_TEMP

    # We compare the keys of the .env that are not in firebase
    ensure::diff_env $FIREBASE_KEY_TEMP $ENV_KEY_TEMP diff_key_firebase_to_env.temp.txt

    DIFF_KEY_FIREBASE_TO_ENV=$(cat diff_key_firebase_to_env.temp.txt)

    # If .env contains keys that firebase does not have, we insert the keys of the .env in firebase 
    if [ ! -z "$DIFF_KEY_FIREBASE_TO_ENV" ]
    then
        echo "The content of the firebase does not correspond to that of .env"
        echo "Updating firebase to match content"

        JSON_TO_PUT="{"
        for line in $DIFF_KEY_FIREBASE_TO_ENV
        do
            LINE_VALUE=$(grep -w $line .env | cut -d '=' -f2)
            JSON_TO_PUT=$JSON_TO_PUT""\"$line\"":"\"$LINE_VALUE\"","
        done

        JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
        curl -X $ACTION -d $JSON_TO_PUT https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
        echo -e ""
    fi

    rm *.temp.txt
}