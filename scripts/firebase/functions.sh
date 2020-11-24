#!/bin/bash

AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
FIREBASE_FILE_TEMP=firebase_env.temp.txt
FIREBASE_KEY_TEMP=firebase_key.temp.txt
ENV_FILE_TEMP=env.temp.txt
ENV_KEY_TEMP=env_key.temp.txt

function firebase::donwload_and_generate_env_temp() {
	AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
	FIREBASE_FILE_TEMP=firebase_env.temp.txt
	curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | sort > $FIREBASE_FILE_TEMP
}

function env::generate_env_temp() {
	ENV_FILE_TEMP=env.temp.txt
	cat .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_FILE_TEMP
}

# Esta función espera un argumento que sea un listado de claves a subir a firebase:
# KEY1 KEY2 KEY3
function firebase::update_keys() {
    echo "Updating firebase keys to match content"
    JSON_TO_PUT="{"
    for line in $@
    do
        LINE_VALUE=$(grep -w $line .env | cut -d '=' -f2 | sed 's/"/\\"/g')
        JSON_TO_PUT=$JSON_TO_PUT""\"$line\"":"\"$LINE_VALUE\"","
    done

    JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
    curl -X PATCH -d $JSON_TO_PUT https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
    echo -e ""
}

# Esta función espera un argumento que sea un listado de claves a borrar:
# KEY1 KEY2 KEY3
function firebase::delete_keys() {
    echo "Deleting firebase keys to match content"
    for KEY in $@
    do
        curl -X DELETE https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp/${KEY}.json?auth=${AUTH}
        echo -e "\nDelete $KEY key in firebase"
    done
}

# Esta función espera un argumento que sea un listado de claves a añadir al .env:
# KEY1 KEY2 KEY3
function env::update_keys() {
    echo "Updating .env to match content: "

    for line in $@
    do
        LINE_VALUE=$(grep -w $line $FIREBASE_FILE_TEMP | cut -d '=' -f2)
        echo -e "${line}=${LINE_VALUE}"
        echo -e "${line}=${LINE_VALUE}" >> .env
    done
}

# Esta función espera un argumento que sea un listado de claves a borrar:
# KEY1 KEY2 KEY3
function env::delete_keys() {
    echo "Deleting .env to match content: "

    for line in $@
    do
        LINE_VALUE=$(grep -w $line $FIREBASE_FILE_TEMP | cut -d '=' -f2)
        echo -e "Deleting ${line} key in .env"
        sed -i "/${line}=/d" .env
    done
}

# Esta funcion generará archivos temporales con las claves de firebase y .env
function generate_key_temp_files() {
    # We download all the data from firebase and put it in a temporary file
    firebase::donwload_and_generate_env_temp

    # We get all the data from the .env and put it in a temporary file
    env::generate_env_temp

    # From the temporary file with the firebase data we generate a temporary file that only contains the keys
    sed 's/=.*//' $FIREBASE_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $FIREBASE_KEY_TEMP

    # From the temporary file with the .env data we generate a temporary file that only contains the keys
    sed 's/=.*//' $ENV_FILE_TEMP | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_KEY_TEMP
}

function diff_env() {
	grep -v -F -x -f $1 $2 > $3
}