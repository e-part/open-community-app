#!/bin/bash

# Run this with:  sudo sh /var/epart/epart-app/deploy_scripts/deploy-prod.sh

cd /var/epart/epart-app
# stop nginx
# sudo nginx -s stop
# update repo
sudo git pull origin master
# install packages. (unsafe-perm is here to allow it to run as root)
sudo npm install
# install client packages
sudo bower install
# build client
sudo NODE_ENV=production grunt build-prd
# or sudo NODE_ENV=production grunt build-prd
# stop running server
sudo systemctl stop epartapp
# start server in background
sudo systemctl start epartapp # should run sudo NODE_ENV=<stage | production> DEBUG=loopback:connector:mysql nohup npm start  &
# start nginx again
# sudo nginx




