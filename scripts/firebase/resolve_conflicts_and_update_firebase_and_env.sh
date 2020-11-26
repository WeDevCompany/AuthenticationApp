#!/bin/bash

source "${BASH_SOURCE%/*}/../ensure.sh"
source "${BASH_SOURCE%/*}/show_firebase_and_env_conflicts.sh"
source "${BASH_SOURCE%/*}/update_firebase_with_manual_conflicts.sh"

function resolve_conflicts_and_update_firebase_and_env() {
    ensure::curl
    MANUAL_CHANGES_FILE_NAME=update_firebase_with_manual_conflicts.commit.firebase
    DELETE_KEYS_FILE_NAME=delete_firebase_key_with_manual_conflicts.commit.firebase
    DIFF_VALUES_FIREBASE_TO_ENV_FILE=diff_values_firebase_to_env.temp.txt

    show_firebase_and_env_conflicts

    while true
    do
        echo -e "\n========================================================="
        echo "                        OPTIONS                         "
        echo "========================================================="
        echo " 1 - Modify firebase with the values ​​of the .env"
        echo " 2 - Modify .env with firebase values"
        echo " 3 - Resolve conflicts manually"
        echo " 4 - Update firebase with selected data"
        echo " 5 - Show conflicts"
        echo " 6 - Exit"
        echo "=========================================================="
        echo "Select option:"
        read opcion
        case $opcion in
            1)  # If .env contains keys that firebase does not have, we insert the .env keys into a file to later update firebase
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
                echo "Data ready to upload to firebase in file $MANUAL_CHANGES_FILE_NAME"
                echo "Remember that firebase will not be updated until the option is selected: \"Update firebase with selected data\""
            ;;
            2)  # If firebase contains keys that .env does not have, we insert the firebase keys in the .env
                for line in $DIFF_VALUES_ENV_TO_FIREBASE
                do
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    LINE_EXISTS_IN_ENV=$(grep -w "$line" .env)
                    if [ -z  "$LINE_EXISTS_IN_ENV" ]
                    then
                        echo "The key do not exists in .env, insert key and value in .env:"
                        echo -e "${LINE_KEY}=${LINE_VALUE}"
                        echo -e "${LINE_KEY}=${LINE_VALUE}" >> .env
                    else
                        echo -e "Updated the following values ​​in the .env:"
                        echo "${LINE_KEY}=${LINE_VALUE}"
                        sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_VALUE}" .env;
                    fi     
                done
            ;;
            3)  # We go through both files showing the differences and solving them manually each one
                JSON_TO_PUT="{"
                KEYS_TO_DELETE=""
                for line in $DIFF_KEYS_FIREBASE_AND_ENV
                do
                    line=$(echo "$line" | sed 's/"/\\"/g')
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_FIREBASE_VALUE=$(grep -w "$LINE_KEY" $DIFF_VALUES_ENV_TO_FIREBASE_FILE | cut -d '=' -f2)
                    LINE_ENV_VALUE=$(grep -w "$LINE_KEY" $DIFF_VALUES_FIREBASE_TO_ENV_FILE | cut -d '=' -f2)

                    echo "=========================================================="
                    echo "Select which data you want to keep:"
                    echo "=========================================================="
                    if [ -z "$LINE_FIREBASE_VALUE" ]
                    then
                        echo "1 - Delete .env key - $LINE_KEY=$LINE_ENV_VALUE"
                    else
                        echo "1 - Update .env with firebase values - $LINE_KEY=$LINE_FIREBASE_VALUE"
                    fi
                    if [ -z "$LINE_ENV_VALUE" ]
                    then
                        echo "2 - Delete firebase key - $LINE_KEY=$LINE_FIREBASE_VALUE"
                    else
                        echo "2 - Update firebase with .env values - $LINE_KEY=$LINE_ENV_VALUE"
                    fi               
                    echo "3 - Do not resolve conflict"
                    echo "=========================================================="
                    read changesFrom
                    case $changesFrom in
                        1) 
                            if [ -z "$LINE_FIREBASE_VALUE" ]
                            then
                                env::delete_keys $LINE_KEY
                            else
                                sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_FIREBASE_VALUE}" .env;
                                CHECK_VALUE=$(grep -w $LINE_KEY .env | cut -d '=' -f2)
                                if [ "$CHECK_VALUE" != "$LINE_FIREBASE_VALUE" ]
                                then
                                    echo "ERROR: An error occurred while modifying the data in the .env"
                                else
                                    echo "Data successfully modified in .env"
                                fi
                            fi
                        ;;
                        2)
                            if [ -z "$LINE_ENV_VALUE" ]
                            then
                                KEYS_TO_DELETE="$KEYS_TO_DELETE $LINE_KEY"
                                echo "data ready to delete in firebase later"
                            else
                                JSON_TO_PUT=$JSON_TO_PUT""\"$LINE_KEY\"":"\"$LINE_ENV_VALUE\"","
                                echo "data ready to upload in firebase later"
                            fi
                        ;;
                        3)
                            echo "Unresolved conflict for key: $LINE_KEY"
                        ;;
                    esac
                done

                if [ "$JSON_TO_PUT" != "{" ]
                then
                    JSON_TO_PUT=$(echo $JSON_TO_PUT"}" | sed -zr 's/,([^,]*$)/\1/')
                    echo $JSON_TO_PUT > $MANUAL_CHANGES_FILE_NAME
                    echo "Data ready to upload to firebase in file $MANUAL_CHANGES_FILE_NAME"
                    echo "Remember that firebase will not be updated until the option is selected: \"Update firebase with selected data\""
                fi

                if [ ! -z "$KEYS_TO_DELETE" ]
                then
                    echo $KEYS_TO_DELETE > $DELETE_KEYS_FILE_NAME
                    echo "Data ready to delete in firebase in file $DELETE_KEYS_FILE_NAME"
                    echo "Remember that firebase will not be updated until the option is selected: \"Update firebase with selected data\""
                fi
            ;;
            4) 
                update_firebase_with_manual_conflicts
                delete_firebase_with_manual_conflicts
            ;;
            5) 
                show_firebase_and_env_conflicts
            ;;
            6)
                rm *.temp.txt
                if [ -f $MANUAL_CHANGES_FILE_NAME ] || [ -f $DELETE_KEYS_FILE_NAME ]
                then
                    rm *.commit.firebase
                fi
                exit
            ;;
        esac
    done

    rm *.temp.txt
    rm *.commit.firebase
}