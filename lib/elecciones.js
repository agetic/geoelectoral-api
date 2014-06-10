var json2csv = require('json2csv');
var config = require('konfig')();
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
  'id_partido_grupo': '_id_partido_antecesor',
  'id_partido': '_id_partido'
};

exports.api = function(req, res) {

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
        res.json(result.rows);
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
      if (err) {
        res.send("Error en los parámetros");
      } else {
        console.log("Respuesta en formato HTML");
        var resultado = req.query.tipo_resultado || 'votos';
        resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
        res.render('elecciones/tabla', {elecciones: result.rows, resultado: resultado});
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