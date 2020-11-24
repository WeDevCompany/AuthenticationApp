#!/bin/bash

source "${BASH_SOURCE%/*}/../ensure.sh"
source "${BASH_SOURCE%/*}/functions.sh"

function firebase::update_firebase_keys_with_env_keys() {
    generate_key_temp_files

    # We compare the keys of the .env that are not in firebase
    diff_env $FIREBASE_KEY_TEMP $ENV_KEY_TEMP diff_key_firebase_to_env.temp.txt

    DIFF_KEY_FIREBASE_TO_ENV=$(cat diff_key_firebase_to_env.temp.txt)

    # If .env contains keys that firebase does not have, we insert the keys of the .env in firebase 
    if [ ! -z "$DIFF_KEY_FIREBASE_TO_ENV" ]
    then
        echo "The content of the firebase does not correspond to that of .env"
        echo "the following keys are not found in firebase:"
        echo "=========================================================="
        echo "$(cat diff_key_firebase_to_env.temp.txt)"
        echo "=========================================================="
        echo " 1 - Update firebase keys"
        echo " 2 - Do not make modifications in firebase"
        echo "=========================================================="
        echo "Select option:"
        read opcion
        case $opcion in
            1)
                firebase::update_keys $DIFF_KEY_FIREBASE_TO_ENV
            ;;
            2)
                echo "No modification made in firebase"
            ;;
        esac
    fi

    rm *.temp.txt
}