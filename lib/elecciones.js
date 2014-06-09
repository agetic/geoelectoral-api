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

exports.api = function(req, res) {

  // La consulta SQL para elecciones de un determinado año
  var consulta_sql = function(req, res, callback) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT * FROM ws_elecciones_por_anio($1)";
    query = client.query(query, [req.query.anio], function (err, result) {
      if (err) {
        return console.error("Error ejecutando consulta: ", err);
      }
      callback(req, res, result.rows);
    });
  };

  // La respuesta en formato JSON
  var respuesta_json = function(req, res) {
    consulta_sql(req, res, function(req, res, rows) {
      console.log("Respuesta en formato JSON");
      res.json(rows);
    });
  };

  // La respuesta en formato CSV
  var respuesta_csv = function(req, res) {
    consulta_sql(req, res, function(req, res, rows) {
      json2csv({data: rows, fields: csv_header }, function(err, csv) {
        if (err) console.log(err);

        console.log("Respuesta en formato CSV");
        res.attachment("elecciones_" + req.query.anio + ".csv");
        res.send(csv);
      });
    });
  };

  // La respuesta en formato HTML
  var respuesta_html = function(req, res) {
    consulta_sql(req, res, function(req, res, rows) {
      console.log("Respuesta en formato HTML");
      res.render('elecciones/tabla', {elecciones: rows});
    });
  };

  // Respuesta con los links de los años de elecciones
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