#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"

function update_env_keys_with_firebase_keys() {
    FIREBASE_FILE_TEMP=firebase_env.temp.txt
    FIREBASE_KEY_TEMP=firebase_key.temp.txt
    ENV_FILE_TEMP=env.temp.txt
    ENV_KEY_TEMP=env_key.temp.txt

    # Descargamos todos los datos de firebase y los metemos en un archivo temporal
    ensure::firebase_env

    # Obtenemos todos los datos del .env y los metemos en un archivo temporal
    ensure::env

    # A partir del archivo temporal con los datos de firebase generamos un archivo temporal que solo contenga las claves
    sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $FIREBASE_KEY_TEMP

    # A partir del archivo temporal con los datos del .env generamos un archivo temporal que solo contenga las claves
    sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_KEY_TEMP

    # Comparamos las claves de firebase que no se encuentran en el .env
    ensure::diff_env $ENV_KEY_TEMP $FIREBASE_KEY_TEMP diff_key_env_to_firebase.temp.txt

    DIFF_KEY_ENV_TO_FIREBASE=$(cat diff_key_env_to_firebase.temp.txt)

    # Si firebase contiene keys que .env no tiene insertamos las claves de firebase en el .env
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