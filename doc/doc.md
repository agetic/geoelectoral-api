# Documentación API GeoElectoral

El Sistema GeoElectoral cuenta con un API en formato `JSON`, `HTML`, y  `CSV`

## URL API de elecciones

La URL a partir del cual se puede ingresar al API REST es la siguiente:

```console
GET /api/v1/elecciones
```

## Parámetros

<table>
  <tr>
    <th>Parámetro</th>
    <th>Descripción</th>
    <th>Por defecto</th>
  </tr>
  <tr>
    <td>`formato`</td>
    <td>
      Establece el formato de salida por ejemplo `HTML`, `JSON`, o `CSV`
      <ul>
        <li>El formato también se puede establecer en la cabecera de la petición `Accept`: `text/html`, `application/json`, o `application/csv`</li>
        <li>El de mayor prioridad es el parámetro `formato` de la URL, porque cuando se consulte al API desde un navegador el valor que envía el navegador en la cabecera `Accept` es `text/html`, por tanto ignoraría el parámetro `formato`, es por eso que primero se verifica los parámetros que se envían en la URL y en segunda se verifica las cabeceras de la petición.</li>
      </ul>
      <strong>Opcional:</strong>
      <ul>
        <li>`formato=[cadena]`</li>
        <li>ejemplo: formato=JSON</li>
      </ul>
    </td>
    <td>
      HTML
    </td>
  </tr>
  <tr>
    <td>`anio`</td>
    <td>
      Establece el año de la elección desde 1979 hasta 2009
      <ul>
        <li>El formato también se puede establecer en la cabecera de la petición `Accept`: `text/html`, `application/json`, o `application/csv`</li>
        <li>El de mayor prioridad es el parámetro `formato` de la URL.</li>
      </ul>
      <strong>Requerido:</strong> En el caso que no esté definido el parámetro `id_eleccion`, caso contrario es un parámetro <em>Opcional</em>
      <ul>
        <li>`anio=[entero]`</li>
        <li>ejemplo: anio=1979</li>
      </ul>
    </td>
    <td>El año de la última elección</td>
  </tr>
  <tr>
    <td>`id_eleccion`</td>
    <td>
      ID de las elecciones plurinominales, uninominales, o especiales, en base al año de la elección <br/>
      <strong>Requerido:</strong> En el caso que no esté definido el parámetro `anio`, caso contrario es un parámetro <em>Opcional</em>
      <ul>
        <li>`id_eleccion=[entero]`</li>
        <li>ejemplo: id_eleccion=14</li>
      </ul>
    </td>
    <td>La elección para presidente o plurinominales</td>
  </tr>
  <tr>
    <td>`id_dpa`</td>
    <td>
      ID de la división político administrativa: Bolivia, La Paz, Oruro, Potosí,... <br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`id_dpa=[entero]`</li>
        <li>ejemplo: id_dpa=1</li>
      </ul>
    </td>
    <td>El ID de Bolivia que es 1</td>
  </tr>
  <tr>
    <td>`id_tipo_dpa`</td>
    <td>
      ID del tipo de división político administrativa: país, departamento, provincia, municipio, circunscripción<br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`id_tipo_dpa=[entero]`</li>
        <li>ejemplo: id_tipo_dpa=2</li>
      </ul>
    </td>
    <td>A nivel país que es 1</td>
  </tr>
  <tr>
    <td>`id_partido_grupo`</td>
    <td>
      ID del partido antecesor de tipo grupo: válidos, emitidos, e inscritos<br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`id_partido_grupo=[entero]`</li>
        <li>ejemplo: id_partido_grupo=83</li>
      </ul>
    </td>
    <td>ID del grupo VALIDOS que es 83</td>
  </tr>
  <tr>
    <td>`id_partido`</td>
    <td>
      ID del partido político de tipo normal<br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`id_partido=[entero]`</li>
        <li>ejemplo: id_partido=83</li>
      </ul>
    </td>
    <td>ID del partido VALIDOS que es 83</td>
  </tr>
  <tr>
    <td>`tipo_resultado`</td>
    <td>
      Los tipos de resultado pueden ser votos, diputados, senadores, o constituyentes<br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`tipo_resultado=[cadena]`</li>
        <li>ejemplo: tipo_resultado=votos</li>
      </ul>
    </td>
    <td>votos</td>
  </tr>
  <tr>
    <td>`tipo_grafico`</td>
    <td>
      El tipo de gráfico que se va a mostrar: tabla, barras, torta, mapa, etc<br/>
      <strong>Opcional:</strong>
      <ul>
        <li>`tipo_grafico=[cadena]`</li>
        <li>ejemplo: tipo_grafico=barras</li>
      </ul>
    </td>
    <td>tabla</td>
  </tr>
</table>

## Ejemplos

### Ejemplo 1:

Listar los resultados de la elección del año 2009 en formato `CSV`:

```console
GET /api/v1/elecciones?anio=2009&formato=csv
```
Para  el caso del año 2009 hay tres tipos de elecciones:

| `id_eleccion` | `anio` | `descripcion`                                                 |
|---------------|--------|---------------------------------------------------------------|
| 1             | 2009   | Votos para presidente - elecciones generales - plurinominales |
| 10            | 2009   | Votos circunscripciones uninominales - elecciones generales   |
| 14            | 2009   | Votos circunscripciones especiales - elecciones generales     |

* En el caso que no se especifique la elección, se toma por defecto `Votos para presidente - elecciones generales - plurinominales`
* Si el parámetro `id_tipo_dpa` no es especificado se toma por defecto a nivel País que es 1

### Ejemplo 2:

Listar los resultados de la elección del año 2009 con los siguientes datos:

* id_eleccion=14 Votos Circunscripciones Especiales
* id_dpa=1
* id_tipo_dpa=2
* id_partido_grupo=83
* id_partido=83
* tipo_resultado=votos

La URL sería de la siguiente manera:

```console
GET /api/v1/elecciones?anio=2009&id_eleccion=14&id_dpa=1&id_tipo_dpa=2&id_partido_grupo=83&id_partido=83&tipo_resultado=votos
```

* En éste ejemplo no se especifica el formato de salida, por tanto, se toma por defecto el formato HTML.

### Ejemplo 3:

Resultados de la elección del año 2009 del departamento de La Paz `id_dpa=2` en formato JSON:

```console
GET /api/v1/elecciones?anio=2009&id_tipo_dpa=2&id_dpa=2&formato=json
```
Los resultados se pueden observar en la sección `JSON` de la Definición de los Formatos de Salida.

## Definición de los Formatos de Salida

El API proveerá los siguientes formatos de salida: `HTML`, `JSON`, y `CSV`

### Descripción de las columnas

Las columnas relevantes para desplegar la información en los formatos `HTML`, `JSON`, y `CSV`, son las siguientes:

* `id_dpa` Identificador de la División Político-Administrativa (DPA)
* `dpa_codigo` para cada tipo de DPA, el código es un identificador único:
  - `país`: el código ISO 3166-2, por ejemplo BO para Bolivia
* `dpa_nombre` Nombre de la DPA de acuerdo al tipo: país, departamento, provincia, municipio, o circunscripción
* `anio` Año de la elección
* `nombre_tipo_resultado` La columna resultado puede ser en cantidad de: votos, diputados, senadores, o constituyentes
* `id_partido` Identificador del Partido Político
* `id_tipo_partido` Identificador del Tipo de Partido Político
* `sigla` La sigla del Partido Político
* `codigo_sigla` Unión de los columnas dpa_codigo y sigla del Partido Político
* `resultado` Cantidad de votos, diputados, senadores, o constituyentes
* `id_eleccion` Identificador de la elección
* `porcentaje` porcentaje con relación a la columna resultado

### Formato HTML

Para el caso del formato HTML el API mostrará una tabla con los resultados de la consulta/petición:
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
      <td>1985</td>
      <td>ACP</td>
      <td>12918</td>
      <td>0.86</td>
    </tr>
    <tr>
      <td>BO</td>
      <td>Bolivia</td>
      <td>1985</td>
      <td>ADN</td>
      <td>493735</td>
      <td>32.83</td>
    </tr>
  </tbody>
</table>
```
Las columnas describen lo siguiente:

* `Código` tiene que ver con el campo `dpa_codigo`
* `Nombre` tiene que ver con el campo `dpa_nombre`
* `Año` tiene que ver con el campo `anio`
* `Sigla` tiene que ver con el campo `sigla`
* `Nº Votos` tiene que ver con el campo `nombre_tipo_resultado` y `resultado`
* `Porcentaje` tiene que ver con el campo `porcentaje`

### Formato JSON

El formato JSON será devuelto en la siguiente estructura (Sitio web de referencia [json:api](http://jsonapi.org/))

```javascript
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
      tipos_partidos: [
        {
          id_partido: 83,
          sigla: "VALIDOS",
          nombre: "los votos validos (todos los partidos politicos)",
          partidos: [
            {
              id_partido: 18,
              id_tipo_partido: 1,
              sigla: "AS",
              resultado: 21185,
              porcentaje: 1.55
            }, {
              ...
            }
            ...
          ]
        }, {
          id_partido: 84,
          sigla: "EMITIDOS",
          nombre: "los votos emitidos, es decir votos blancos y nulos tambien",
          partidos: [ ... ]
        }, {
          id_partido: 85,
          sigla: "INSCRITOS",
          nombre: "total de electores inscritos, es decir abstencion y votos anulados tambien",
          partidos: [ ... ]
        },
        ...
      ]
    }, {
      id_dpa: 3,
      dpa_codigo: "03",
      dpa_nombre: "Cochabamba",
      tipos_partidos: [
        {
          id_partido: 83,
          ...
          partidos: [ ... ]
        }, {
          id_partido: 84,
          ...
          partidos: [ ... ]
        }, {
          id_partido: 85,
          ...
          partidos: [ ... ]
        }
      ]
    },
    ...
  ]
}
```

### Formato CSV

El formato CSV contendrá la siguiente información:

```csv
"id_dpa","dpa_codigo","dpa_nombre","anio","nombre_tipo_resultado","id_partido","id_tipo_partido","sigla","codigo_sigla","resultado","id_eleccion","porcentaje"
1,"BO","Bolivia",1985,"votos",32,1,"ACP","BO ACP",12918,7,0.86
1,"BO","Bolivia",1985,"votos",26,1,"ADN","BO ADN",493735,7,32.83
...
```

## Herramientas de Desarrollo

Las herramientas software que se va a utilizar para el desarrollo del prototipo del API REST, en base a la información que debe proporcionar, cuya respuesta sea óptima, y sin utilizar muchos recursos.

El API REST el cual proveerá el servicio capaz de responder las preguntas de las elecciones será desarrollado con las siguientes herramientas:

| Herramienta            | Software                                                |
|------------------------|---------------------------------------------------------|
| Base de Datos          | PostgreSQL, y PostGIS para la base de datos geográficos |
| Framework Web          | Node.js y Express.js / HTML, CSS, javascript            |
| Gráficos de resultados | D3.js, HTML, CSV                                        |

El Frontend que hará usó del API REST tendrá una interfaz gráfica web será desarrollado con las siguientes herramientas:

| Herramienta            | Software                              |
|------------------------|---------------------------------------|
| Base de Datos          | PostgreSQL                            |
| Servidor de mapas      | GeoServer                             |
| Framework Web          | Ruby On Rails / HTML, CSS, javascript |
| Visualización de mapas | D3.js con GeoJSON                     |
| Gráficos de resultados | D3.js                                 |

## Consultas sobre el API REST

### Listado de elecciones

URL de la petición:

```url
GET /api/v1/elecciones
```

Resultado:

* Listado de todas las elecciones desde 1979 hasta 2009

```
| Año  | URL                          |
|------|------------------------------|
| 2009 | /api/v1/elecciones?anio=2009 |
| 2006 | /api/v1/elecciones?anio=2006 |
| 2005 | /api/v1/elecciones?anio=2005 |
| 2002 | /api/v1/elecciones?anio=2002 |
| 1997 | /api/v1/elecciones?anio=1997 |
| 1993 | /api/v1/elecciones?anio=1993 |
| 1989 | /api/v1/elecciones?anio=1989 |
| 1985 | /api/v1/elecciones?anio=1985 |
| 1980 | /api/v1/elecciones?anio=1980 |
| 1979 | /api/v1/elecciones?anio=1979 |
```

### Elecciones del año 2009

URL de la petición:

```url
GET /api/v1/elecciones?anio=2009
```

Resultado:

* Muestra las tres elecciones de ese año

```
| id_eleccion | descripcion                      | URL                                         |
|-------------|----------------------------------|---------------------------------------------|
| 1           | 2009 - elecciones plurinominales | /api/v1/elecciones?anio=2009&id_eleccion=1  |
| 10          | 2009 - elecciones uninominales   | /api/v1/elecciones?anio=2009&id_eleccion=10 |
| 14          | 2009 - elecciones especiales     | /api/v1/elecciones?anio=2009&id_eleccion=14 |
```

### Elecciones plurinominales del año 2009

URL de la petición:

```url
GET /api/v1/elecciones?anio=2009&id_eleccion=1
GET /api/v1/elecciones?id_eleccion=1
```
> Nota: Cualquiera de éstas dos URLs debería retornar los mismos resultados

Resultado:

* Resultados de votos de los partidos a nivel Bolivia (nivel País)
* También se debe poder seleccionar: País, Departamento, Provincia, Municipio, Circunscripción
* También por tipo de resultado: votos, diputados, senadores, constituyentes

```
| id_partido | sigla  | resultado | URL                                            |
|------------|--------|-----------|------------------------------------------------|
| 18         | AS     | 104952    | /api/v1/elecciones?id_eleccion=1&id_partido=18 |
| 1          | BSD    | 9709      | /api/v1/elecciones?id_eleccion=1&id_partido=1  |
| 2          | GENTE  | 15388     | /api/v1/elecciones?id_eleccion=1&id_partido=2  |
| 25         | MAS    | 2851996   | /api/v1/elecciones?id_eleccion=1&id_partido=25 |
| 3          | MUSPA  | 21829     | /api/v1/elecciones?id_eleccion=1&id_partido=3  |
| 27         | PPB-CN | 1190603   | /api/v1/elecciones?id_eleccion=1&id_partido=27 |
| 4          | PULSO  | 12635     | /api/v1/elecciones?id_eleccion=1&id_partido=4  |
| 16         | UN     | 255299    | /api/v1/elecciones?id_eleccion=1&id_partido=16 |
```

### Elecciones plurinominales del 2009 del partido MAS

URL de la petición:

```url
GET /api/v1/elecciones?id_eleccion=1&id_partido=25
```
Resultado:

* Resultados de votos del partido MAS a nivel Bolivia (nivel País)
* También se debe poder seleccionar: País, Departamento, Provincia, Municipio, Circunscripción
* También por tipo de resultado: votos, diputados, senadores, constituyentes

```
| id_partido | sigla  | resultado | URL                                            |
|------------|--------|-----------|------------------------------------------------|
| 18         | AS     | 104952    | /api/v1/elecciones?id_eleccion=1&id_partido=18 |
| 1          | BSD    | 9709      | /api/v1/elecciones?id_eleccion=1&id_partido=1  |
| 2          | GENTE  | 15388     | /api/v1/elecciones?id_eleccion=1&id_partido=2  |
| 25         | MAS    | 2851996   | /api/v1/elecciones?id_eleccion=1&id_partido=25 |
| 3          | MUSPA  | 21829     | /api/v1/elecciones?id_eleccion=1&id_partido=3  |
| 27         | PPB-CN | 1190603   | /api/v1/elecciones?id_eleccion=1&id_partido=27 |
| 4          | PULSO  | 12635     | /api/v1/elecciones?id_eleccion=1&id_partido=4  |
| 16         | UN     | 255299    | /api/v1/elecciones?id_eleccion=1&id_partido=16 |
```


