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

# Descargamos todos los datos de firebase y los metemos en un archivo temporal
ensure::firebase_env

# Obtenemos todos los datos del .env y los metemos en un archivo temporal
ensure::env

# Comparamos los valores con sus claves del .env que no se encuentran en firebase
diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '>' | sed 's/> *//' > diff_values_firebase_to_env.temp.txt
DIFF_VALUES_FIREBASE_TO_ENV=$(cat diff_values_firebase_to_env.temp.txt)

# Comparamos los valores con sus claves de firebase que no se encuentran en el .env
diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '<' | sed 's/< *//' > diff_values_env_to_firebase.temp.txt
DIFF_VALUES_ENV_TO_FIREBASE=$(cat diff_values_env_to_firebase.temp.txt)

if [ -z "$DIFF_VALUES_FIREBASE_TO_ENV" ] && [ -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
then
    echo "firebase and .env have the same values"
    exit 0
fi

rm diff_values_firebase_and_env.temp.txt

if [ ! -z "$DIFF_VALUES_FIREBASE_TO_ENV" ]
then
    echo -e "Conflictos encontrados en el .env distintos de firebase:\n" >> diff_values_firebase_and_env.temp.txt
    echo -e "$DIFF_VALUES_FIREBASE_TO_ENV\n" >> diff_values_firebase_and_env.temp.txt
fi

if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
then
    echo -e "Conflictos encontrados en el firebase distintos de .env:\n" >> diff_values_firebase_and_env.temp.txt
    echo -e "$DIFF_VALUES_ENV_TO_FIREBASE\n" >> diff_values_firebase_and_env.temp.txt
fi

echo -e "Existen conflictos que deben ser resueltos:\n"
echo -e "$(cat diff_values_firebase_and_env.temp.txt)\n"

while true
do
    echo "========================================================="
    echo "                        OPCIONES                         "
    echo "========================================================="
    echo " 1 - Modificar firebase con los valores del .env"
    echo " 2 - Modificar .env con los valores de firebase"
    echo " 3 - Resolver los conflictos manualmente"
    echo " 4 - Mostrar los conflictos"
    echo " 5 - Salir"
    echo "=========================================================="
    echo "Selecione una opcion:"
    read opcion
    case $opcion in
        1)  # Si .env contiene keys que firebase no tiene insertamos las claves del .env en firebase 
            if [ ! -z "$DIFF_VALUES_FIREBASE_TO_ENV" ]
            then
                JSON_TO_PUT="{"
                for line in $DIFF_VALUES_FIREBASE_TO_ENV
                do
                    line=$(echo "$line" | sed 's/"/\\"/g')
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    JSON_TO_PUT=$JSON_TO_PUT""\"$LINE_KEY\"":"\"$LINE_VALUE\"","
                done

                JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
                echo $JSON_TO_PUT > update_firebase_with_manual_conflicts.commit.firebase
            fi
        ;;
        2)  # Si firebase contiene keys que .env no tiene insertamos las claves de firebase en el .env
            echo -e "Actualizados los siguientes valores en el .env\n"
            if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
            then
                for line in $DIFF_VALUES_ENV_TO_FIREBASE
                do
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    echo "${LINE_KEY}=${LINE_VALUE}"
                    sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_VALUE}" .env;
                done
            fi
        ;;
        3)  # Recorremos ambos ficheros mostrando las diferencias y resolviendolas manualmente cada una
            if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
            then
                JSON_TO_PUT="{"
                for line in $DIFF_VALUES_ENV_TO_FIREBASE
                do
                    line=$(echo "$line" | sed 's/"/\\"/g')
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_FIREBASE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    LINE_ENV_VALUE=$(grep -w "$LINE_KEY" diff_values_firebase_to_env.temp.txt | cut -d '=' -f2)

                    echo "=========================================================="
                    echo "Selecione con que datos te quieres quedar:"
                    echo "=========================================================="
                    echo "1 - Actualizar .env con los valores de firebase - $LINE_KEY=$LINE_FIREBASE_VALUE"
                    echo "2 - Actualizar firebase con los valores de .env - $LINE_KEY=$LINE_ENV_VALUE"
                    echo "=========================================================="
                    read changesFrom
                    case $changesFrom in
                        1) 
                            sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_FIREBASE_VALUE}" .env;
                            CHECK_VALUE=$(grep -w $LINE_KEY .env | cut -d '=' -f2)
                            if [ "$CHECK_VALUE" != "$LINE_FIREBASE_VALUE" ]
                            then
                                echo "ERROR: Ha ocurrido un error al modificar los datos en el .env"
                            else
                                echo "Datos modificados correctamente en el .env"
                            fi 
                        ;;
                        2)
                            JSON_TO_PUT=$JSON_TO_PUT""\"$LINE_KEY\"":"\"$LINE_ENV_VALUE\"","
                        ;;
                    esac
                done

                if [ "$JSON_TO_PUT" != "{" ]
                then
                    JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
                    echo $JSON_TO_PUT > update_firebase_with_manual_conflicts.commit.firebase
                    echo "Datos preparados para subir a firebase en el archivo update_firebase_with_manual_conflicts.commit.firebase"
                fi
            fi
        ;;
        4) echo -e "\n$(cat diff_values_firebase_and_env.temp.txt)\n"
        ;;
        5)exit
        ;;
    esac
done