API GeoElectoral
================

Provee los resultados de las elecciones desde 1979 en formatos `HTML`, `JSON`, y `CSV`.

### Home - Página principal

```
http://localhost:3000/
```

### Lista de elecciones

```
http://localhost:3000/api/v1/elecciones
```
Listado de los años que hubo elecciones, dando la posibilidad de obtener los resultados en formato `JSON`, `CSV`, o `HTML`

### Resultados de la elección para presidente del año 2009

Los resultados de la elección para presidente del año 2009 a nivel Bolivia.

```
http://localhost:3000/api/v1/elecciones?anio=2009&formato=json
```
Nota: Para más información sobre los parámetros de la URL visitar https://intranet.geo.gob.bo/proyectos/projects/vice-atlas-electoral/wiki/Versi%C3%B3n_010

Resultados de las elecciones del año 2009 en formato `JSON`:

```json
{
  eleccion: {
    id_eleccion: 1,
    anio: 2009,
    nombre_tipo_resultado: "votos"
  },
  dpas: [
    {
      id_dpa: 2,
      dpa_codigo: "02",
      dpa_nombre: "La Paz",
      partidos: [
        {
          id_partido: 18,
          id_tipo_partido: 1,
          sigla: "AS",
          resultado: 21185,
          porcentaje: 1.55
        },
        {
          id_partido: 1,
          id_tipo_partido: 1,
          sigla: "BSD",
          resultado: 3017,
          porcentaje: 0.22
        },
        ...
      ]
    }
  ]
}
```

Resultados de las elecciones del año 2009 en formato `CSV`:

```csv
"id_dpa","dpa_codigo","dpa_nombre","anio","nombre_tipo_resultado","id_partido","id_tipo_partido","sigla","codigo_sigla","resultado","id_eleccion","porcentaje"
1,"BO","Bolivia",2009,"votos",18,1,"AS","BO AS",104952,1,2.35
...
```

Resultados de las elecciones del año 2009 en formato `HTML`:

```html
<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Nombre</th>
      <th>Año</th>
      <th>Sigla</th>
      <th>Nº Votos</th>
      <th>Porcentaje</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>BO</td>
      <td>Bolivia</td>
      <td>2009</td>
      <td>AS</td>
      <td>104952</td>
      <td>2.35%</td>
    </tr>
    ...
  </tbody>
</table>
```

Instalación de la Aplicación
============================

### Instalación de Node.js en Ubuntu 12.04

```console
$ sudo apt-get install python-software-properties
$ sudo apt-add-repository ppa:chris-lea/node.js
$ sudo apt-get update
```
Instalar node.js

```console
$ sudo apt-get install nodejs
```
Instalar npm

```console
$ sudo apt-get install npm
```

### Clonar el repositorio

```console
$ git clone git@gitlab.geo.gob.bo:emendoza/geoelectoral-api.git
$ cd geoelectoral-api
$ npm install
```

Ejecutamos el servidor

```console
$ DEBUG=geoelectoral ./bin/www
```

### Abrir en el navegador

```
http://localhost:3000
```