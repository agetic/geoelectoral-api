API GeoElectoral
================

Provee los resultados de las elecciones desde 1979 en formatos `HTML`, `JSON`, y `CSV`.

### Home - Página principal

```
http://localhost:3000/
```

### Años con elecciones

```
http://localhost:3000/api/anio
```
Listado de los años que hubo elecciones, dando la posibilidad de obtener los resultados en formato `JSON` o `CSV`

### Resultados de la elección para presidente del año 2009

Los resultados de la elección para presidente del año 2009 a nivel Bolivia.

```
http://localhost:3000/api/anio/2009.json
```
Resultados de las elecciones del año 2009 en formato `JSON`:

```json
[
  {
    id_dpa: 1,
    dpa_codigo: "BO",
    dpa_nombre: "Bolivia",
    anio: 2009,
    nombre_tipo_resultado: "votos",
    id_partido: 18,
    id_tipo_partido: 1,
    sigla: "AS",
    codigo_sigla: "BO AS",
    resultado: 104952,
    id_eleccion: 1,
    porcentaje: 2.35
  },
  ...
]
```

Resultados de las elecciones del año 2009 en formato `CSV`:

```csv
"id_dpa","dpa_codigo","dpa_nombre","anio","nombre_tipo_resultado","id_partido","id_tipo_partido","sigla","codigo_sigla","resultado","id_eleccion","porcentaje"
1,"BO","Bolivia",2009,"votos",18,1,"AS","BO AS",104952,1,2.35
...
```

Instalación
===========

### Instalar las dependencias

```console
cd geoelectoral
npm install
DEBUG=geoelectoral ./bin/www
```

### Abrir en el navegador

```
http://localhost:3000
```