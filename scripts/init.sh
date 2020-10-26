#!/bin/sh
if [ ! -f .env ]; then
    echo "⚠️ .env file not found, copying example"
    cp .env.example .env
    sh -c "./scripts/generate_session_token.sh";
fi