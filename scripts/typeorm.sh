#!/bin/sh
# Getting .env values to use on the script
CONTAINER_ID=$(grep -w CONTAINER_SERVICE_NAME .env | cut -d '=' -f2)

echo "☢ Executing TypeORM command ${@} with N args ${#}"
echo "============================"
docker-compose exec $CONTAINER_ID ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm -f ormconfig.cli.ts $@