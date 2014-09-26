var http = require('http');

/**
 * Proxy para obtener geoJSON de los servicios de GeoBolivia
 *
 * GET /api/v1/proxy?id_tipo_dpa=2
 */
var dpa = function(req, res) {

  var cql_filter = 'id_dpa_antecesor={idDpa}+AND+id_tipo_dpa={idTipoDpa}';
  cql_filter = cql_filter.replace(/{idDpa}/g, req.query.idDpa);
  cql_filter = cql_filter.replace(/{idTipoDpa}/g, req.query.idTipoDpa);

  var options = {
    host: 'geo.gob.bo',
    port: 80,
    path: '/geoserver/geoelectoral/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoelectoral:geoelectoral-dpa&maxFeatures=50&outputFormat=json&cql_filter=' + cql_filter,
    method: 'GET'
  };

  var req = http.request(options, function(result) {
    var body = '';
    result.setEncoding('utf8');
    result.on('data', function (chunk) {
      body += chunk;
    });
    result.on('end', function() {
      res.set('content-type', 'application/json; charset=UTF-8');
      res.json(JSON.parse(body));
    });
  });

  req.on('error', function(e) {
    console.log('Problema con la petición: ' + e.message);
  });

  req.end();

};

exports.dpa = dpa;