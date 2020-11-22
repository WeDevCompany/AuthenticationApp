#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
source "${BASH_SOURCE%/*}/update_firebase_keys_with_env_keys.sh"
source "${BASH_SOURCE%/*}/update_env_keys_with_firebase_keys.sh"
source "${BASH_SOURCE%/*}/resolve_conflicts_and_update_firebase_and_env.sh"

ensure::jq
ensure::curl
AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
VALUES=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH})
FIREBASE_MD5_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)
MD5_ENV=$(cat .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)

if [ "$FIREBASE_MD5_ENV" = "$MD5_ENV" ]
then
    echo "firebase and .env have the same content"
    exit 0
fi

# Si .env contiene keys que firebase no tiene insertamos las claves del .env en firebase 
update_firebase_keys_with_env_keys

# Si firebase contiene keys que .env no tiene insertamos las claves de firebase en el .env
update_env_keys_with_firebase_keys

# Recorremos firebase y .env mostrando las diferencias y resolviendolas manualmente cada una
resolve_conflicts_and_update_firebase_and_env