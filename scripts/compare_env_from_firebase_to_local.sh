#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
ensure::jq
ensure::curl
AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
VALUES=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH})
FIREBASE_MD5_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)\")|.[]" | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)
MD5_ENV=$(sed 's/=.*//' .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)

echo "firebase:" $FIREBASE_MD5_ENV
echo "env: " $MD5_ENV

if [ "$FIREBASE_MD5_ENV" != "$MD5_ENV" ]
then
    echo "El contenido del .env no se corresponde con el de firebase"
    echo "Actualizando firebase para igualar el contenido"
    FIREBASE_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)\")|.[]" | sed '/^[[:space:]]*$/d' | sort > firebase_env.temp.txt)
    ENV=$(sed 's/=.*//' .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > env.temp.txt)
    DIFF=$(grep -v -F -x -f firebase_env.temp.txt env.temp.txt)
    JSON_TO_PUT="{"
    for line in $DIFF
    do
        LINE_VALUE=$(grep -w $line .env | cut -d '=' -f2)
        JSON_TO_PUT=$JSON_TO_PUT""\"$line\"":"\"$LINE_VALUE\"","
    done
    
    JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
    echo $JSON_TO_PUT
    curl -X PUT -d $JSON_TO_PUT https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
fi
