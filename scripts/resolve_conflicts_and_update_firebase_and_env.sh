#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
source "${BASH_SOURCE%/*}/show_firebase_and_env_conflicts.sh"
source "${BASH_SOURCE%/*}/update_firebase_with_manual_conflicts.sh"

function resolve_conflicts_and_update_firebase_and_env() {
    ensure::curl
    MANUAL_CHANGES_FILE_NAME=update_firebase_with_manual_conflicts.commit.firebase
    DIFF_VALUES_FIREBASE_TO_ENV_FILE=diff_values_firebase_to_env.temp.txt

    show_firebase_and_env_conflicts

    while true
    do
        echo -e "\n========================================================="
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
                    echo "3 - No resolver conflicto"
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
                        3)
                            echo "Conflicto no resuelto para la key: $LINE_KEY"
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
                update_firebase_with_manual_conflicts
            ;;
            5) 
                show_firebase_and_env_conflicts
            ;;
            6)
                rm *.temp.txt
                exit
            ;;
        esac
    done

    rm *.temp.txt
}