#!/bin/bash

# Run this with:  sudo sh /var/epart/epart-app/deploy_scripts/deploy.sh
BRANCH=""
while getopts 'b:' flag; do
  case "${flag}" in
    b) BRANCH="${OPTARG}" ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

if [[ (-z "$BRANCH") ]]; then
    BRANCH="dev"
fi
echo branch to deploy is $BRANCH

cd /var/epart/epart-app
# update repo
sudo git fetch origin
sudo git reset --hard origin/$BRANCH
# install packages. (unsafe-perm is here to allow it to run as root)
sudo npm install
# install client packages
sudo bower install
# build client
sudo NODE_ENV=stage grunt build-stg
# or sudo NODE_ENV=production grunt build-prd
# stop running server
sudo systemctl stop epartapp
# start server in background
sudo systemctl start epartapp # should run sudo NODE_ENV=< stage | production > nohup npm start  &

# sudo DEBUG=loopback:connector:mysql NODE_ENV=stage nohup npm start



