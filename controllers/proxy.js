var config = require('konfig')();
var http = require('http');
var lzString = require('lz-string');

/**
 * Proxy para obtener geoJSON de los servicios de GeoBolivia
 *
 * GET /api/v1/proxy?id_tipo_dpa=2
 */
var dpa = function(req, res) {
  console.log('rq.query', req.query);
  var cql_filter = 'id_dpa_antecesor={idDpa}+AND+id_tipo_dpa={idTipoDpa}';
  cql_filter = cql_filter.replace(/{idDpa}/g, req.query.idDpa);
  cql_filter = cql_filter.replace(/{idTipoDpa}/g, req.query.idTipoDpa);
  var lzs = (req.query.lz==1)?'lz':'';

  var generarOpcion = function(idTipoDpa, cql_filter) {
    var path = '/geoserver/{namespace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName={namespace}:{geoelectoralCapa}&maxFeatures=5000&outputFormat=json&cql_filter=' + cql_filter;
    path = path.replace(/{namespace}/g, config.app.geoserver.namespace);
    if (idTipoDpa == 2) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-provincia'+lzs);
    } else if (idTipoDpa == 3 || idTipoDpa == 5) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-municipio'+lzs);
    } else if (idTipoDpa == 4) {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-municipio'+lzs);
    } else {
      path = path.replace(/{geoelectoralCapa}/g, 'geoelectoral-departamento'+lzs);
    }
    return {
      host: config.app.geoserver.host,
      port: config.app.geoserver.port,
      path: path,
      method: 'GET'
    };
  };

  var options = generarOpcion(req.query.idTipoDpaActual, cql_filter);

  var req = http.request(options, function(result) {
    var body = '';
    result.setEncoding('utf8');
    result.on('data', function (chunk) {
      body += chunk;
    });
    result.on('end', function() {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (body.indexOf('<?xml') !== -1) {
        res.json({error: "Error en el servidor de mapas"});
      } else if(result.statusCode==404){
        res.json({error: "404"});
      } else {
        if(lzs) // enviar comprimido
          res.json({lz:lzString.compressToEncodedURIComponent(body)});
        else
          res.json(JSON.parse(body));
      }
    });
  });

  req.on('error', function(e) {
    console.log('Problema con la petición: ' + e.message);
  });

  req.end();

};

exports.dpa = dpa;