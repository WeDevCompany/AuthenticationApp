#!/bin/bash

AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
MANUAL_CHANGES_FILE_NAME=update_firebase_with_manual_conflicts.commit.firebase
ACTION="PATCH"

if [ ! -f $MANUAL_CHANGES_FILE_NAME ]
then
    echo "No existe el archivo con los cambios manuales para subir a firebase"
    exit 0
fi

JSON_MANUAL_CHANGES=$(cat $MANUAL_CHANGES_FILE_NAME | sed '/^[[:space:]]*$/d')

if [ ! -n "${JSON_MANUAL_CHANGES-unset}" ]
then
    echo "No existen cambios manuales para subir a firebase"
    exit 0
fi

echo "Actualizando firebase con los cambios seleccionados manualmente"
curl -X $ACTION -d $JSON_MANUAL_CHANGES https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH}
rm *.commit.firebase
