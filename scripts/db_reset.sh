#!/bin/sh

echo "✋ Stoping containers"
echo "============================"
npm run docker:down
echo "🗑 Erasing data"
echo "============================"
sudo rm -rf ./data
echo "👍 Starting containers"
echo "============================"
npm run docker:watch
