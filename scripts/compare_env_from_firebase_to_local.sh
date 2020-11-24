#!/bin/bash

source "${BASH_SOURCE%/*}/ensure.sh"
source "${BASH_SOURCE%/*}/firebase/update_firebase_keys_with_env_keys.sh"
source "${BASH_SOURCE%/*}/firebase/delete_firebase_keys_with_env_keys.sh"
source "${BASH_SOURCE%/*}/firebase/update_env_keys_with_firebase_keys.sh"
source "${BASH_SOURCE%/*}/firebase/delete_env_keys_with_firebase_keys.sh"
source "${BASH_SOURCE%/*}/firebase/resolve_conflicts_and_update_firebase_and_env.sh"

ensure::jq
ensure::curl
AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
VALUES=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH})
FIREBASE_MD5_ENV=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)
MD5_ENV=$(cat .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort | md5sum | cut -d' ' -f1)

if [ "$FIREBASE_MD5_ENV" = "$MD5_ENV" ]
then
    echo "firebase and .env have the same content"
    exit 0
fi

# If .env contains keys that firebase does not have, we insert the keys of the .env in firebase 
firebase::update_firebase_keys_with_env_keys

# If firebase contains keys that .env does not have, we delete the firebase keys that are not in the .env
firebase::delete_firebase_keys_with_env_keys

# If firebase contains keys that .env does not have, we insert the firebase keys in the .env
env::update_env_keys_with_firebase_keys

# If .env contains keys that firebase does not have, we delete the .env keys that are not in the firebase
env::delete_env_keys_with_firebase_keys

# We go through firebase and .env showing the differences and solving them manually each one
resolve_conflicts_and_update_firebase_and_env