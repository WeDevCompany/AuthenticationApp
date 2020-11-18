#!/bin/bash
function ensure::jq() {
	REQUIRED_PKG=jq
	PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $REQUIRED_PKG|grep "install ok installed")
	echo "Checking for $REQUIRED_PKG: {STATUS} $PKG_OK"
	if [ "" = "$PKG_OK" ]; then
	  echo "⛔ No $REQUIRED_PKG. Setting up $REQUIRED_PKG."
	  sudo apt-get --yes install $REQUIRED_PKG 
	fi
}

function ensure::curl() {
	REQUIRED_PKG=curl
	PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $REQUIRED_PKG|grep "install ok installed")
	echo "Checking for $REQUIRED_PKG: {STATUS} $PKG_OK"
	if [ "" = "$PKG_OK" ]; then
	  echo "⛔ No $REQUIRED_PKG. Setting up $REQUIRED_PKG."
	  sudo apt-get --yes install $REQUIRED_PKG 
	fi
}

function ensure::firebase_env() {
	AUTH=$(grep -w AUTH .firebase_oauth | cut -d '=' -f2)
	FIREBASE_FILE_TEMP=firebase_env.temp.txt
	curl https://authenticacionapp-44d60.firebaseio.com/AuthenticationApp.json?auth=${AUTH} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | sort > $FIREBASE_FILE_TEMP
}

function ensure::env() {
	ENV_FILE_TEMP=env.temp.txt
	cat .env | sed -e '/^[ \t]*#/d' | sed '/^[[:space:]]*$/d' | sort > $ENV_FILE_TEMP
}

function ensure::diff_env() {
	grep -v -F -x -f $1 $2 > $3
}