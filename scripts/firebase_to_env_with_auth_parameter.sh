#!/bin/bash

if [ ! -f .env ]
then
    source "${BASH_SOURCE%/*}/ensure.sh"
    ensure::jq
    ensure::curl
    AUTH=$1
    VALUES=$(curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH})
    echo $VALUES | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" > .env
fi