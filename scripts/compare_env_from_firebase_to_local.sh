#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
ensure::jq
ensure::curl
AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
VALUES=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH})
FIREBASE_MD5_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)\")|.[]" | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)
MD5_ENV=$(sed 's/=.*//' .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)

if [ "$FIREBASE_MD5_ENV" = "$MD5_ENV" ]
then
    echo "firebase and .env have the same content"
    #exit 0
fi

echo "The content of the .env does not correspond to that of firebase"
echo "Updating firebase to match content"
ACTION="PATCH"
FIREBASE_FILE_TEMP=firebase_env.temp.txt
FIREBASE_KEY_TEMP=firebase_key.temp.txt
ENV_FILE_TEMP=env.temp.txt
ENV_KEY_TEMP=env_key.temp.txt
#FIREBASE_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)\")|.[]" | sed '/^[[:space:]]*$/d' | sort > ${FIREBASE_FILE_TEMP})
#ENV=$(sed 's/=.*//' .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > ${ENV_FILE_TEMP})
#DIFF=$(grep -v -F -x -f ${FIREBASE_FILE_TEMP} ${ENV_FILE_TEMP})

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
    JSON_TO_PUT="{"
    for line in $DIFF_KEY_FIREBASE_TO_ENV
    do
        LINE_VALUE=$(grep -w $line .env | cut -d '=' -f2)
        JSON_TO_PUT=$JSON_TO_PUT""\"$line\"":"\"$LINE_VALUE\"","
    done

    JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
    echo "json: " $JSON_TO_PUT
    echo "action: " $ACTION
    curl -X $ACTION -d $JSON_TO_PUT https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
    #rm $FIREBASE_FILE_TEMP $ENV_FILE_TEMP
fi

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
    for line in $DIFF_KEY_ENV_TO_FIREBASE
    do
        LINE_VALUE=$(grep -w $line $FIREBASE_FILE_TEMP | cut -d '=' -f2)
        echo "${line}=${LINE_VALUE}"
        echo -e "${line}=${LINE_VALUE}" >> .env
    done
fi

bash scripts/resolve_conflicts_and_update_firebase_and_env.sh