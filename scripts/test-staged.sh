#!/bin/sh
# Getting .env values to use on the script
CONTAINER_ID=$(grep -w CONTAINER_SERVICE_NAME .env | cut -d '=' -f2)

echo "☢ Executing Test ☑️"
echo "============================"
docker-compose exec $CONTAINER_ID npm run test --findRelatedTests
