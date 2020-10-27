#!/bin/sh
if [ ! -f .env ]; then
    echo "⚠️ .env file not found, copying example"
    cp .env.example .env
    sudo apt-get -y install uuid-runtime
    sh -c "./scripts/generate_session_token.sh";
fi