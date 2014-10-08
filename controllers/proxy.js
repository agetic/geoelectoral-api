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

  var generarOpcion = function(idTipoDpa, cql_filter) {
    var path = '/geoserver/geoelectoral/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoelectoral:{geoelectoralCapa}&maxFeatures=50&outputFormat=json&cql_filter=' + cql_filter;
    if (idTipoDpa == 2) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-departamento');
    } else if (idTipoDpa == 3 || idTipoDpa == 5) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-provincia');
    } else if (idTipoDpa == 4) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-municipio');
    } else {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-dpa');
    }
    return {
      host: 'geo.gob.bo',
      port: 80,
      path: path,
      method: 'GET'
    };
  };

  var options = generarOpcion(req.query.idTipoDpa, cql_filter);

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