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

client = new pg.Client(connectionString);
client.connect();

/* GET /api/anio/:anio.:format. */
router.get('/anio/:anio.:format?', function(req, res) {
  if (req.params.format === undefined) {
    res.render('api');
    return;
  }

  var rows = [];
  var params = [];

  params.push(req.params.anio);
  params.push('votos');
  params.push(1);
  params.push(2);
  params.push(1);
  params.push(83);
  params.push(83);

  query = "SELECT * FROM ws_elecciones($1, $2, $3, $4, $5, $6, $7)";
  query = client.query(query, params);

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