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
        echo "                        OPTIONS                         "
        echo "========================================================="
        echo " 1 - Modify firebase with the values ​​of the .env"
        echo " 2 - Modify .env with firebase values"
        echo " 3 - Resolve conflicts manually"
        echo " 4 - Update firebase with selected data"
        echo " 5 - Show conflicts"
        echo " 6 - Exit"
        echo "=========================================================="
        echo "Selecione una opcion:"
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
                echo -e "Updated the following values ​​in the .env:"
                for line in $DIFF_VALUES_ENV_TO_FIREBASE
                do
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    echo "${LINE_KEY}=${LINE_VALUE}"
                    sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_VALUE}" .env;
                done
            ;;
            3)  # We go through both files showing the differences and solving them manually each one
                JSON_TO_PUT="{"
                for line in $DIFF_VALUES_ENV_TO_FIREBASE
                do
                    line=$(echo "$line" | sed 's/"/\\"/g')
                    LINE_KEY=$(echo "$line" | cut -d '=' -f1)
                    LINE_FIREBASE_VALUE=$(echo "$line" | cut -d '=' -f2)
                    LINE_ENV_VALUE=$(grep -w "$LINE_KEY" $DIFF_VALUES_FIREBASE_TO_ENV_FILE | cut -d '=' -f2)

                    echo "=========================================================="
                    echo "Select which data you want to keep:"
                    echo "=========================================================="
                    echo "1 - Update .env with firebase values - $LINE_KEY=$LINE_FIREBASE_VALUE"
                    echo "2 - Update firebase with .env values - $LINE_KEY=$LINE_ENV_VALUE"
                    echo "3 - Do not resolve conflict"
                    echo "=========================================================="
                    read changesFrom
                    case $changesFrom in
                        1) 
                            sed -i "/${LINE_KEY}=/c ${LINE_KEY}=${LINE_FIREBASE_VALUE}" .env;
                            CHECK_VALUE=$(grep -w $LINE_KEY .env | cut -d '=' -f2)
                            if [ "$CHECK_VALUE" != "$LINE_FIREBASE_VALUE" ]
                            then
                                echo "ERROR: An error occurred while modifying the data in the .env"
                            else
                                echo "Data successfully modified in .env"
                            fi 
                        ;;
                        2)
                            JSON_TO_PUT=$JSON_TO_PUT""\"$LINE_KEY\"":"\"$LINE_ENV_VALUE\"","
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