#!/bin/sh
# Getting .env values to use on the script
CONTAINER_ID=$(grep -w MYSQL_HOST .env | cut -d '=' -f2)

echo "✋ Stoping containers"
echo "============================"
npm run docker:down
echo "🗑 Erasing data"
echo "============================"
sudo rm -rf ./data
echo "👍 Starting containers"
echo "============================"
npm run docker:watch
