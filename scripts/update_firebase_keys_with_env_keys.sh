#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
ensure::curl
FIREBASE_FILE_TEMP=firebase_env.temp.txt
FIREBASE_KEY_TEMP=firebase_key.temp.txt
ENV_FILE_TEMP=env.temp.txt
ENV_KEY_TEMP=env_key.temp.txt
AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
ACTION="PATCH"

# Descargamos todos los datos de firebase y los metemos en un archivo temporal
ensure::firebase_env

# Obtenemos todos los datos del .env y los metemos en un archivo temporal
ensure::env

# A partir del archivo temporal con los datos de firebase generamos un archivo temporal que solo contenga las claves
sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $FIREBASE_KEY_TEMP

# A partir del archivo temporal con los datos del .env generamos un archivo temporal que solo contenga las claves
sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_KEY_TEMP

# Comparamos las claves del .env que no se encuentran en firebase
ensure::diff_env $FIREBASE_KEY_TEMP $ENV_KEY_TEMP diff_key_firebase_to_env.temp.txt

DIFF_KEY_FIREBASE_TO_ENV=$(cat diff_key_firebase_to_env.temp.txt)

# Si .env contiene keys que firebase no tiene insertamos las claves del .env en firebase 
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
fi