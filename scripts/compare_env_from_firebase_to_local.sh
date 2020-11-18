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
    return 0
fi

echo "The content of the .env does not correspond to that of firebase"
echo "Updating firebase to match content"
ACTION="PATCH"
FIREBASE_FILE_TEMP=firebase_env.temp.txt
ENV_FILE_TEMP=env.temp.txt
#FIREBASE_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)\")|.[]" | sed '/^[[:space:]]*$/d' | sort > ${FIREBASE_FILE_TEMP})
#ENV=$(sed 's/=.*//' .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > ${ENV_FILE_TEMP})
#DIFF=$(grep -v -F -x -f ${FIREBASE_FILE_TEMP} ${ENV_FILE_TEMP})


ensure::firebase_env
ensure::env
sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > firebase_key.temp.txt
sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > env_key.temp.txt
ensure::diff_env firebase_key.temp.txt env_key.temp.txt diff_key_firebase_to_env.temp.txt


DIFF_KEY_FIREBASE_TO_ENV=$(cat diff_key_firebase_to_env.temp.txt)

# Si env contiene keys que firebase no tiene insertamos las claves de .env en firebase 
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

ensure::firebase_env
sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > firebase_key.temp.txt
sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > env_key.temp.txt
ensure::diff_env env_key.temp.txt firebase_key.temp.txt diff_key_env_to_firebase.temp.txt

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
