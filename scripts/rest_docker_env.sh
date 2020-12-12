#!/bin/bash

npm run docker:down && docker stop $(docker ps -aq) || true && docker rm $(docker ps -aq) || true && sudo rm -rf ../data || true && sudo rm -rf ../data || true && sudo rm -rf ./node_modules || true
