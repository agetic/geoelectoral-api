#!/bin/bash
git pull origin master
npm install
NOVE_ENV=production forever stop bin/www
NOVE_ENV=production forever start bin/www