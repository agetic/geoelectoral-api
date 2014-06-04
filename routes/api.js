var express = require('express');
var json2csv = require('json2csv');
var pg = require('pg')
  , connectionString
  , client
  , query;

var router = express.Router();

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

connectionString = 'postgres://postgres:postgres@localhost:5432/geoelectoral';

/* GET /api/anio */
router.get('/anio', function(req, res) {
  client = new pg.Client(connectionString);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();

  if (req.params.format === undefined) {
    query = "SELECT DISTINCT ano FROM public.elecciones ORDER BY ano";
    query = client.query(query, function(err, result) {
      if (err) {
        return console.error('Error ejecutando consulta', err);
      }
      res.render('api', {anios: result.rows});
    });
    return;
  }
});

/* GET /api/anio/:anio.:format. */
router.get('/anio/:anio.:format?', function(req, res) {
  client = new pg.Client(connectionString);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();

  var rows = [];

  query = "SELECT * FROM ws_elecciones_por_anio($1)";
  query = client.query(query, [req.params.anio]);

  query.on('row', function(result) {
    rows.push(result);
  });

  query.on('error', function(error) {
    console.log('Error: ' + error);
  });

  query.on('end', function(result) {
    console.log('Se enviaron ' + result.rowCount + ' filas');

    if (req.params.format === 'json') {
      res.json(rows);
    } else if (req.params.format === 'csv') {
      json2csv({data: rows, fields: csv_header }, function(err, csv) {
        if (err) console.log(err);

        res.setHeader('Content-Type', 'application/csv; charset=UTF-8');
        res.send(csv);
      });
    }

  });
});

module.exports = router;