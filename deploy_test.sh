#!/bin/bash

# Path de Node.js
#NPM_PATH=/home/nhuasebe/.nvm/v0.10.29

# El sistema se ejecutará en entorno de producción y en el puerto 3000
NODE_ENV=production
PORT=3000
LOG_PATH=log/$NODE_ENV.$PORT.log

#PATH=$NPM_PATH/bin:$PATH
#export PATH NPM_PATH NODE_ENV PORT LOG_PATH
export NODE_ENV PORT LOG_PATH

# Directorio donde está ubicado el sistema
SOURCE_API=/var/www/geoelectoral-api

if [ -d $SOURCE_API ]; then
  echo "El sistema se ejecutará en '$NODE_ENV' en el puerto $PORT"

  # Ingresamos al directorio del sistema
  cd $SOURCE_API

  # Ejecutamos pull con Git. Ya está configurado el ssh key para el usuario
  # emendoza para que no pida password en GitLab
  #git pull origin master

  # Instalamos los paquetes y dependencias para ejecutar el Sistema
  npm install

  # Detenemos forever y volvemos a iniciarlo para que el sistema se ejecute
  forever stop bin/www
  forever start --append -o $LOG_PATH -e $LOG_PATH --minUptime 1000 --spinSleepTime 1000 bin/www
else
  echo "No existe el directorio $SOURCE_API"
fi

