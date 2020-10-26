#!/bin/sh
sed "s/COOKIE_UUID_KEY1=.*/COOKIE_UUID_KEY1=$(uuidgen -r)/gm" .env > .env.temp1
sed "s/COOKIE_UUID_KEY2=.*/COOKIE_UUID_KEY2=$(uuidgen -r)/gm" .env.temp1 > .env.temp
rm .env.temp1;
mv .env.temp .env