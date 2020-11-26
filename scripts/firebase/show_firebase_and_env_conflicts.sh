#!/bin/bash

source "${BASH_SOURCE%/*}/../ensure.sh"
source "${BASH_SOURCE%/*}/functions.sh"

function show_firebase_and_env_conflicts() {
    ensure::jq
    ensure::curl
    FIREBASE_FILE_TEMP=firebase_env.temp.txt
    ENV_FILE_TEMP=env.temp.txt
    DIFF_VALUES_FIREBASE_TO_ENV_FILE=diff_values_firebase_to_env.temp.txt
    DIFF_VALUES_ENV_TO_FIREBASE_FILE=diff_values_env_to_firebase.temp.txt
    DIFF_VALUES_FIREBASE_AND_ENV_FILE=diff_values_firebase_and_env.temp.txt
    DIFF_KEYS_FIREBASE_AND_ENV_FILE=diff_keys_firebase_and_env.temp.txt

    # We download all the data from firebase and put it in a temporary file
    firebase::donwload_and_generate_env_temp

    # We get all the data from the .env and put it in a temporary file
    env::generate_env_temp

    # We compare the values ​​with their .env keys that are not found in firebase
    diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '>' | sed 's/> *//' > $DIFF_VALUES_FIREBASE_TO_ENV_FILE
    DIFF_VALUES_FIREBASE_TO_ENV=$(cat $DIFF_VALUES_FIREBASE_TO_ENV_FILE)

    # We compare the values ​​with your firebase keys not found in the .env
    diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '<' | sed 's/< *//' > $DIFF_VALUES_ENV_TO_FIREBASE_FILE
    DIFF_VALUES_ENV_TO_FIREBASE=$(cat $DIFF_VALUES_ENV_TO_FIREBASE_FILE)

    # We compare the firebase and .env keys and obtain uniq diff keys
    diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '<\|>' | sed 's/> *//' | sed 's/< *//' | sed 's/=.*//' | sort | uniq > $DIFF_KEYS_FIREBASE_AND_ENV_FILE
    DIFF_KEYS_FIREBASE_AND_ENV=$(cat $DIFF_KEYS_FIREBASE_AND_ENV_FILE)

    # We check if there is any conflict
    if [ -z "$DIFF_VALUES_FIREBASE_TO_ENV" ] && [ -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
    then
        echo "firebase and .env have the same values"
        rm *.temp.txt
        exit 0
    fi

    # We delete the file with the conflicts if it exists
    if [ -f $DIFF_VALUES_FIREBASE_AND_ENV_FILE ]
    then
        rm $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    # We use the file generated before with the conflicts found in the .env that are not in firebase
    # and we enter the values ​​with their keys in a file to collect the conflicts
    if [ ! -z "$DIFF_VALUES_FIREBASE_TO_ENV" ]
    then
        echo -e "Conflicts found in the .env other than firebase:\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
        echo -e "$DIFF_VALUES_FIREBASE_TO_ENV\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    # We use the file generated before with the conflicts found in firebase that are not in the .env
    # and we enter the values ​​with their keys in a file to collect the conflicts
    if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
    then
        echo -e "Conflicts found in the firebase other than .env:\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
        echo -e "$DIFF_VALUES_ENV_TO_FIREBASE\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    echo -e "There are conflicts that must be resolved:\n"
    echo -e "$(cat $DIFF_VALUES_FIREBASE_AND_ENV_FILE)\n"
}