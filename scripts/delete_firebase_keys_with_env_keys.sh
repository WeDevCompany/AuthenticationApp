#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
source "${BASH_SOURCE%/*}/firebase/functions.sh"

function firebase::delete_firebase_keys_with_env_keys() {
    generate_key_temp_files

    # We compare the firebase keys not found in the .env
    ensure::diff_env $ENV_KEY_TEMP $FIREBASE_KEY_TEMP diff_key_env_to_firebase.temp.txt

    DIFF_KEY_ENV_TO_FIREBASE=$(cat diff_key_env_to_firebase.temp.txt)

    # If firebase contains keys that .env does not have, we delete the firebase keys that are not in the .env
    if [ ! -z "$DIFF_KEY_ENV_TO_FIREBASE" ]
    then
        echo "The content of the firebase does not correspond to that of .env"
        echo "The following keys are not found in .env:"
        echo "=========================================================="
        echo "$(cat diff_key_env_to_firebase.temp.txt)"
        echo "=========================================================="
        echo " 1 - Delete firebase keys"
        echo " 2 - Do not make modifications in .env"
        echo "=========================================================="
        echo "Select option:"
        read opcion
        case $opcion in
            1)
                firebase::delete_keys $DIFF_KEY_ENV_TO_FIREBASE
            ;;
            2)
                echo "No modification made in firebase"
            ;;
        esac
    fi

    rm *.temp.txt
}