var json2csv = require('json2csv');
var config = require('konfig')();
var utils = require('../lib/utils');
var pg = require('pg')
  , client
  , query;

var csv_header = [
  'id_dpa',
  'dpa_codigo',
  'dpa_nombre',
  'anio',
  'nombre_tipo_resultado',
  'id_partido',
  'id_tipo_partido',
  'sigla',
  'codigo_sigla',
  'resultado',
  'id_eleccion',
  'porcentaje'
  ];

var sql_params = {
  'anio': '_anio',
  'tipo_resultado': '_nombre_tipo_resultado',
  'id_dpa': '_id_dpa',
  'id_tipo_dpa': '_id_tipo_dpa',
  'id_eleccion': '_id_eleccion',
  'id_tipo_eleccion': '_id_tipo_eleccion',
  'id_partido_grupo': '_id_partido_antecesor',
  'id_partido': '_id_partido'
};

/* GET /elecciones?anio=2009&formato=json */
var api = function(req, res) {

  // Parsing URL
  var parsing_url = function(req, res) {
    var keys = Object.keys(sql_params);
    for(var i=0; i<keys.length; i++) {
      if (req.query[keys[i]] === undefined) {
        keys.splice(i, 1);
        i--;
      }
    };
    return {
      params: keys.map(function(e) { return req.query[e]; }),
      sql : "SELECT * FROM ws_elecciones("
        + keys.map(function(e, i) { return sql_params[e] + ':=$' + (i+1); }).join(',')
        + ")"
    };
  }

  // La consulta SQL para elecciones de un determinado año
  var consulta_sql = function(req, res, callback) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = parsing_url(req, res);
    console.log(query);
    query = client.query(query.sql, query.params, function (err, result) {
      if (err) {
        console.error("Error ejecutando consulta: ", err);
      }
      callback(req, res, err, result);
    });
  };

  // La respuesta en formato JSON
  var respuesta_json = function(req, res) {
    consulta_sql(req, res, function(req, res, err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Respuesta en formato JSON");
        res.json(utils.eleccion_dpas_json(result.rows));
      }
    });
  };

  // La respuesta en formato CSV
  var respuesta_csv = function(req, res) {
    consulta_sql(req, res, function(req, res, err, result) {
      if (err) {
        res.send("Error en los parámetros");
      } else {
        json2csv({data: result.rows, fields: csv_header }, function(err, csv) {
          if (err) console.log(err);

          console.log("Respuesta en formato CSV");
          res.attachment("elecciones_" + req.query.anio + ".csv");
          res.send(csv);
        });
      }
    });
  };

  // La respuesta en formato HTML
  var respuesta_html = function(req, res) {
    consulta_sql(req, res, function(req, res, err, result) {
      //res.set('content-type', 'text/html; charset=UTF-8');
      if (err) {
        res.send("Error en los parámetros");
      } else {
        console.log("Respuesta en formato HTML");
        var resultado = req.query.tipo_resultado || 'votos';
        var tipo_grafico = req.query.tipo_grafico || 'tabla';
        resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
        res.render('elecciones/' + tipo_grafico, {elecciones: result.rows, resultado: resultado});
      }
    });
  };

  // Respuesta con los links de los años de elecciones en CSV, JSON, y HTML
  var respuesta_html_anios = function(req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT DISTINCT ano FROM public.elecciones ORDER BY ano";
    query = client.query(query, function(err, result) {
      if (err) {
        return console.error('Error ejecutando consulta', err);
      }
      res.render('api', {anios: result.rows});
    });
  };

  // Enviar respuesta de acuerdo a la petición
  switch (req.query.formato) {
    case "json":
      respuesta_json(req, res);
      break;

    case "csv":
      respuesta_csv(req, res);
      break;

    case "html":
      respuesta_html(req, res);
      break;

    default:
      res.format({
        json: function() {
          respuesta_json(req, res);
        },
        csv: function() {
          respuesta_csv(req, res);
        },
        html: function() {
          if (req.param('anio') || req.param('id_eleccion')) {
            respuesta_html(req, res);
          } else {
            respuesta_html_anios(req, res);
          }
        }
      });
      break;
  };
};

/* GET /elecciones/:anio/info */
var info = function(req, res) {
  // Información de las elecciones por año
  var informacion_json = function(req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT DISTINCT ano FROM public.elecciones ORDER BY ano";
    query = client.query(query, function(err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        console.error("Error ejecutando consulta: ", err);
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Elecciones info respuesta en formato JSON");
        res.json(utils.elecciones_info_json(result.rows));
      }
    });
  }

  // Enviar información de elecciones en formato JSON
  informacion_json(req, res);
};

/* GET /anios */
var anios = function(req, res) {
  // Información de las elecciones por año
  var informacion_json = function(req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT * FROM ws_anios_elecciones()";
    query = client.query(query, function(err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        console.error("Error ejecutando consulta: ", err);
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Elecciones info respuesta en formato JSON");
        res.json(utils.array_anios_json(result.rows));
      }
    });
  }

  // Enviar información de elecciones en formato JSON
  informacion_json(req, res);
};

/* GET /anios/eleccion */
var anios_eleccion = function(req, res) {
  // Información de las elecciones por año
  var informacion_json = function(req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT * FROM ws_anios_elecciones()";
    query = client.query(query, function(err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        console.error("Error ejecutando consulta: ", err);
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Elecciones info respuesta en formato JSON");
        res.json(utils.array_anios_eleccion_json(result.rows));
      }
    });
  }

  // Enviar información de elecciones en formato JSON
  informacion_json(req, res);
};

/* GET /elecciones/dpa?cod=010101&anio=2009&id_tipo_eleccion=1&id_tipo_dpa=4formato=json */
var dpa = function(req, res) {
  // Información de las elecciones en el dpa
  var informacion_json = function(req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    // -> probar como funcion almacenada
    query = "SELECT el.* ";
    query+= "       ,dm.id_dpa,dm.nombre,dm.codigo,dm.seccion,dm.id_dpa_superior ";
    query+= "       ,pa.nombre partido,pa.sigla,pa.color1 ";
    query+= "       ,re.resultado,re.observacion,dm.url_wiki ";
    query+= "FROM elecciones el ";
    query+= "JOIN resultados re ON re.id_eleccion=el.id_eleccion ";
    query+= "JOIN dpa dm ON dm.id_dpa=re.id_dpa AND dm.id_tipo_dpa=re.id_tipo_dpa ";
    query+= "JOIN partidos pa ON pa.id_partido=re.id_partido AND pa.id_tipo_partido=re.id_tipo_partido ";
    query+= "WHERE re.id_tipo_resultado=1 "
    query+= "  AND dm.codigo='"+req.query.cod+"' ";
    if(req.query.id_tipo_eleccion)
      query+= "  AND el.id_tipo_eleccion="+req.query.id_tipo_eleccion+" ";
    if(req.query.id_tipo_dpa)
      query+= "  AND dm.id_tipo_dpa="+req.query.id_tipo_dpa+" ";
    if(req.query.anio)
      query+= "  AND el.ano="+req.query.anio+" ";
    query+= "ORDER BY el.fecha, re.resultado DESC ";

    query = client.query(query, function(err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        console.error("Error ejecutando consulta: ", err);
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Elecciones info respuesta en formato JSON");
        res.json( utils.eleccion_dpacod_json(result.rows) );
      }
    });
  }

  // Enviar información de elecciones en formato JSON
  informacion_json(req, res);
}

exports.api = api;
exports.info = info;
exports.anios = anios;
exports.anios_eleccion = anios_eleccion;
exports.dpa = dpa;
