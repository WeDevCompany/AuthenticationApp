#!/bin/sh
# Getting .env values to use on the script
MYSQL_DB=$(grep -w MYSQL_DB .env | cut -d '=' -f2)
MYSQL_DB_TEST=$(grep -w MYSQL_DB_TEST .env | cut -d '=' -f2)
MYSQL_USER=$(grep -w MYSQL_USER .env | cut -d '=' -f2)
MYSQL_PASSWD=$(grep -w MYSQL_PASSWD .env | cut -d '=' -f2)
SQL_DUMP=$(grep -w SQL_DUMP .env | cut -d '=' -f2)
CONTAINER_ID=$(grep -w MYSQL_HOST .env | cut -d '=' -f2)

mkdir -p $SQL_DUMP
echo "CREATE DATABASE IF NOT EXISTS $MYSQL_DB;\nCREATE DATABASE IF NOT EXISTS $MYSQL_DB_TEST;" > $SQL_DUMP/0-database.sql;

docker-compose exec -T $CONTAINER_ID  mysql -u$MYSQL_USER -p$MYSQL_PASSWD < $SQL_DUMP/0-database.sql