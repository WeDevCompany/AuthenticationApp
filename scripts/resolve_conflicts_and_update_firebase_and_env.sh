#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
ensure::jq
ensure::curl
FIREBASE_FILE_TEMP=firebase_env.temp.txt
ENV_FILE_TEMP=env.temp.txt
MANUAL_CHANGES_FILE_NAME=update_firebase_with_manual_conflicts.commit.firebase
DIFF_VALUES_FIREBASE_TO_ENV_FILE=diff_values_firebase_to_env.temp.txt
DIFF_VALUES_ENV_TO_FIREBASE_FILE=diff_values_env_to_firebase.temp.txt

# Descargamos todos los datos de firebase y los metemos en un archivo temporal
ensure::firebase_env

# Obtenemos todos los datos del .env y los metemos en un archivo temporal
ensure::env

# Comparamos los valores con sus claves del .env que no se encuentran en firebase
diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '>' | sed 's/> *//' > $DIFF_VALUES_FIREBASE_TO_ENV_FILE
DIFF_VALUES_FIREBASE_TO_ENV=$(cat $DIFF_VALUES_FIREBASE_TO_ENV_FILE)

# Comparamos los valores con sus claves de firebase que no se encuentran en el .env
diff $FIREBASE_FILE_TEMP $ENV_FILE_TEMP | grep '<' | sed 's/< *//' > $DIFF_VALUES_ENV_TO_FIREBASE_FILE
DIFF_VALUES_ENV_TO_FIREBASE=$(cat $DIFF_VALUES_ENV_TO_FIREBASE_FILE)

# Comprobamos si existe algun conflicto
if [ -z "$DIFF_VALUES_FIREBASE_TO_ENV" ] && [ -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
then
    echo "firebase and .env have the same values"
    exit 0
fi

# Borramos el fichero con los conflictos
rm diff_values_firebase_and_env.temp.txt

# Utilizamos el archivo antes generado con los conflictos encontrados en el .env que no estan en firebase
# e introducimos los valores con sus claves en un archivo para recopilar los conflictos
if [ ! -z "$DIFF_VALUES_FIREBASE_TO_ENV" ]
then
    echo -e "Conflictos encontrados en el .env distintos de firebase:\n" >> diff_values_firebase_and_env.temp.txt
    echo -e "$DIFF_VALUES_FIREBASE_TO_ENV\n" >> diff_values_firebase_and_env.temp.txt
fi

# Utilizamos el archivo antes generado con los conflictos encontrados en firebase que no estan en el .env
# e introducimos los valores con sus claves en un archivo para recopilar los conflictos
if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
then
    echo -e "Conflictos encontrados en el firebase distintos de .env:\n" >> diff_values_firebase_and_env.temp.txt
    echo -e "$DIFF_VALUES_ENV_TO_FIREBASE\n" >> diff_values_firebase_and_env.temp.txt
fi

echo -e "Existen conflictos que deben ser resueltos:\n"
echo -e "$(cat diff_values_firebase_and_env.temp.txt)\n"

while true
do
    echo -e "========================================================="
    echo "                        OPCIONES                         "
    echo "========================================================="
    echo " 1 - Modificar firebase con los valores del .env"
    echo " 2 - Modificar .env con los valores de firebase"
    echo " 3 - Resolver los conflictos manualmente"
    echo " 4 - Actualizar firebase con los datos seleccionados"
    echo " 5 - Mostrar los conflictos"
    echo " 6 - Salir"
    echo "=========================================================="
    echo "Selecione una opcion:"
    read opcion
    case $opcion in
        1)  # Si .env contiene keys que firebase no tiene insertamos las claves del .env en un archivo para actualizar posteriormente firebase
            JSON_TO_PUT="{"
            for line in $DIFF_VALUES_FIREBASE_TO_ENV
            do
                line=$(echo "$line" | sed 's/"/\\"/g')
                LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                JSON_TO_PUT=$JSON_TO_PUT""\"$LINE_KEY\"":"\"$LINE_VALUE\"","
            done

            JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
            echo $JSON_TO_PUT > $MANUAL_CHANGES_FILE_NAME
            echo "Datos preparados para subir a firebase en el archivo $MANUAL_CHANGES_FILE_NAME"
            echo "Recuerde que no se actualizará firebase hasta seleccionar la opción: \"Actualizar firebase con los datos seleccionados\""
        ;;
        2)  # Si firebase contiene keys que .env no tiene insertamos las claves de firebase en el .env
            echo -e "Actualizados los siguientes valores en el .env:"
            for line in $DIFF_VALUES_ENV_TO_FIREBASE
            do
                LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                echo "${LINE_KEY}=${LINE_VALUE}"
                sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_VALUE}" .env;
            done
        ;;
        3)  # Recorremos ambos ficheros mostrando las diferencias y resolviendolas manualmente cada una
            JSON_TO_PUT="{"
            for line in $DIFF_VALUES_ENV_TO_FIREBASE
            do
                line=$(echo "$line" | sed 's/"/\\"/g')
                LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                LINE_FIREBASE_VALUE=$(echo "$line" | cut -d '=' -f2)
                LINE_ENV_VALUE=$(grep -w "$LINE_KEY" $DIFF_VALUES_FIREBASE_TO_ENV_FILE | cut -d '=' -f2)

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
                echo $JSON_TO_PUT > $MANUAL_CHANGES_FILE_NAME
                echo "Datos preparados para subir a firebase en el archivo $MANUAL_CHANGES_FILE_NAME"
                echo "Recuerde que no se actualizará firebase hasta seleccionar la opción: \"Actualizar firebase con los datos seleccionados\""
            fi
        ;;
        4) 
            bash scripts/update_firebase_with_manual_conflicts.sh
        ;;
        5) echo -e "\n$(cat diff_values_firebase_and_env.temp.txt)\n"
        ;;
        6)exit
        ;;
    esac
done