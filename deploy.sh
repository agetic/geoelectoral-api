#!/bin/bash
NPM_PATH=/home/emendoza/.nvm/v0.10.29

PATH=$NPM_PATH/bin:$PATH
export PATH NPM_PATH

cd /var/www/geoelectoral-api
git pull origin master
npm install
NOVE_ENV=production forever stop bin/www
NOVE_ENV=production forever start bin/www