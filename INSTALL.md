# Instalación

## Prerequisitos

La instalación y configuración se la realizó sobre el Sistema Operativo Debian Wheezy.

Creación de usuario de sistema operativo para realizar el despliegue:

```
$ sudo adduser geoelectoral
$ sudo su - geoelectoral
```

Instalación de dependencias:

```
$ sudo apt-get install postgresql-9.1 git gcc make libxml2-dev libxslt-dev g++ libpq-dev apache2 libapache2-mod-proxy-html
```

Instalar Node.js:

```
$ sudo apt-get install curl
$ curl -sL https://deb.nodesource.com/setup | bash -
$ sudo apt-get install nodejs nodejs-legacy
```

Instalar Forever: Es una herramienta de línea de comando que asegura que un script en
Node.js se ejecute continuamente, es decir, para siempre (NPM, 2014)

```
$ npm install -g forever
```

Clonar el repositorio:

```
$ sudo su - geoelectoral
$ cd ~
$ git clone http://gitlab.geo.gob.bo/geobolivia/geoelectoral-api.git
$ cd geoelectoral-api
```

Creación de Base de Datos: Para poder acceder a la Base de Datos se creará el usuario
`geoelectoral` con la contraseña `geoelectoral` con acceso solo a la base de datos
`geoelectoral`

```
$ sudo su - postgres
$ psql
postgres=# create user geoelectoral with password 'geoelectoral';
postgres=# create database geoelectoral encoding 'UTF-8' owner geoelectoral;
```

Cargar el backup de GeoElectoral (Backup de la versión inicial/prototipo GeoElectoral).

Instalación de procedimientos almacenados en la base de datos `geoelectoral`:

```
$ psql -U geoelectoral -d geoelectoral -f ws_anios_elecciones.sql
$ psql -U geoelectoral -d geoelectoral -f ws_elecciones.sql
$ psql -U geoelectoral -d geoelectoral -f ws_elecciones_por_anio.sql
```

Nota: Si los procedimientos almacenados existen eliminarlos y volverlos a instalar

Configuramos la base de datos en el archivo `config/app.yml` en la sección de `production`:

```
$ cp config/app.yml.sample config/app.yml
$ nano config/app.yml
```
```
...
production:
  port: 3000
  db:
    user: 'geoelectoral'
    password: 'geoelectoral'
    database: 'geoelectoral'
    host: 'localhost'
    port: 5432
  geoserver:
    host: 'geo.gob.bo'
    port: 80
    namespace: 'geoelectoral'
```

También se puede modificar la configuración de GeoServer indicando el servidor y el espacio de nombres.

## Apache

Mover la aplicación al directorio `/var/www`:

```
$ cd ~
$ sudo mv geoelectoral-api /var/www
```

El API REST cuenta con un script bash llamado `deploy.sh` que permite realizar
automáticamente el despliegue. Para ejecutar el script utilizar el siguiente comando.

```
$ bash /var/www/geoelectoral-api/deploy.sh
EL DEPLOY FUE CORRECTO
```

Éste comando desplegará el API REST (Backend) en el puerto `3000` del servidor, si se necesita modificar el puerto es necesario editar el archivo `deploy.sh`

Configuramos en el servidor web Apache2 el virtual host:

```
$ cd /etc/apache2/sites-available
$ sudo nano default
```

Adicionamos el siguiente contenido en el archivo:

```apache
<VirtualHost *:80>
  ServerName sitio-de-prueba.com.bo
  # SSL Engine Switch:
  # Enable/Disable SSL for this virtual host.
  # SSLEngine on
  # SSLCertificateFile /etc/ssl/certs/sitio-de-prueba.com.bo.crt
  # SSLCertificateKeyFile /etc/ssl/private/sitio-de-prueba.com.bo.key
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^/geoelectoral-api$ /geoelectoral-api/ [R]
    #RewriteCond %{SERVER_PORT} !^443$
    RewriteCond %{REQUEST_URI} ^/geoelectoral-api/
    RewriteRule ^geoelectoral-api/$ http://localhost:3000/ [P]
  </IfModule>

  # Carga de los módulos de proxy
  <IfModule !mod_proxy.c>
    LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
  </IfModule>
  <IfModule !mod_proxy_http.c>
    LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
  </IfModule>
  ProxyRequests Off
  <Proxy *>
    Order deny,allow
    Deny from all
    Allow from localhost
  </Proxy>
  ProxyPass /geoelectoral-api http://localhost:3000
  <Location /geoelectoral-api>
    ProxyPassReverse /
    SetOutputFilter proxy-html
    ProxyHTMLURLMap http://localhost:3000 /geoelectoral-api
    ProxyHTMLURLMap / /geoelectoral-api/
  </Location>
  CustomLog /var/log/apache2/default/access.log combined
  ErrorLog /var/log/apache2/default/error.log
</VirtualHost>
```

Habilitar módulos de Apache2:

```
$ sudo a2enmod rewrite proxy proxy_http proxy_connect
```

Después de finalizar la configuración reiniciar Apache2:

```
$ sudo /etc/init.d/apache2 restart
```

Con esto debería estar configurado la aplicación en:

```
http://sitio-de-prueba.com.bo/geoelectoral-api
```