#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"

function show_firebase_and_env_conflicts() {
    ensure::jq
    ensure::curl
    FIREBASE_FILE_TEMP=firebase_env.temp.txt
    ENV_FILE_TEMP=env.temp.txt
    DIFF_VALUES_FIREBASE_TO_ENV_FILE=diff_values_firebase_to_env.temp.txt
    DIFF_VALUES_ENV_TO_FIREBASE_FILE=diff_values_env_to_firebase.temp.txt
    DIFF_VALUES_FIREBASE_AND_ENV_FILE=diff_values_firebase_and_env.temp.txt

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
        rm *.temp.txt
        exit 0
    fi

    # Borramos el fichero con los conflictos si existe
    if [ -f $DIFF_VALUES_FIREBASE_AND_ENV_FILE ]
    then
        rm $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    # Utilizamos el archivo antes generado con los conflictos encontrados en el .env que no estan en firebase
    # e introducimos los valores con sus claves en un archivo para recopilar los conflictos
    if [ ! -z "$DIFF_VALUES_FIREBASE_TO_ENV" ]
    then
        echo -e "Conflictos encontrados en el .env distintos de firebase:\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
        echo -e "$DIFF_VALUES_FIREBASE_TO_ENV\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    # Utilizamos el archivo antes generado con los conflictos encontrados en firebase que no estan en el .env
    # e introducimos los valores con sus claves en un archivo para recopilar los conflictos
    if [ ! -z "$DIFF_VALUES_ENV_TO_FIREBASE" ]
    then
        echo -e "Conflictos encontrados en el firebase distintos de .env:\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
        echo -e "$DIFF_VALUES_ENV_TO_FIREBASE\n" >> $DIFF_VALUES_FIREBASE_AND_ENV_FILE
    fi

    echo -e "Existen conflictos que deben ser resueltos:\n"
    echo -e "$(cat $DIFF_VALUES_FIREBASE_AND_ENV_FILE)\n"
}