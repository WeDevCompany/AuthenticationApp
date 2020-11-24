#!/bin/bash

source "${BASH_SOURCE%/*}/../ensure.sh"
source "${BASH_SOURCE%/*}/functions.sh"

function env::update_env_keys_with_firebase_keys() {
    generate_key_temp_files

    # We compare the firebase keys not found in the .env
    diff_env $ENV_KEY_TEMP $FIREBASE_KEY_TEMP diff_key_env_to_firebase.temp.txt

    DIFF_KEY_ENV_TO_FIREBASE=$(cat diff_key_env_to_firebase.temp.txt)

    # If firebase contains keys that .env does not have, we insert the firebase keys in the .env
    if [ ! -z "$DIFF_KEY_ENV_TO_FIREBASE" ]
    then
        echo "The content of the .env does not correspond to that of firebase"
        echo "the following keys are not found in .env:"
        echo "=========================================================="
        echo "$(cat diff_key_env_to_firebase.temp.txt)"
        echo "=========================================================="
        echo " 1 - Update .env keys"
        echo " 2 - Do not make modifications in .env"
        echo "=========================================================="
        echo "Select option:"
        read opcion
        case $opcion in
            1)
                env::update_keys $DIFF_KEY_ENV_TO_FIREBASE
            ;;
            2)
                echo "No modification made in .env"
            ;;
        esac
    fi

    rm *.temp.txt
}