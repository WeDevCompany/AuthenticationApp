#!/bin/sh
# Getting .env values to use on the script
MYSQL_USER=$(grep -w MYSQL_USER .env | cut -d '=' -f2)
MYSQL_PASSWD=$(grep -w MYSQL_PASSWD .env | cut -d '=' -f2)
SQL_DUMP=$(grep -w SQL_DUMP .env | cut -d '=' -f2)
CONTAINER_ID=$(grep -w MYSQL_HOST .env | cut -d '=' -f2)

docker-compose exec -T $CONTAINER_ID  mysql -u$MYSQL_USER -p$MYSQL_PASSWD < $SQL_DUMP/0-database.sql