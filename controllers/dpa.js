var config = require('konfig')();
var pg = require('pg')
  , client
  , query;


/**
 * Lista de dpas con id_tipo_dpa
 *
 * GET /api/v1/dpa
 */
var dpa = function(req, res) {

  var listaDpas = function (req, res) {
    client = new pg.Client(config.app.db);
    client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
    client.connect();

    query = "SELECT id_dpa, id_tipo_dpa, nombre, id_dpa_superior ";
    query += "FROM dpa ";
    if(req.query.fecha){
      query += "WHERE '"+req.query.fecha+"' BETWEEN fecha_creacion_corte AND fecha_supresion_corte ";
      query += "  AND (id_tipo_dpa<=6 OR id_tipo_dpa=8) ";
    }else{
      query += "WHERE id_tipo_dpa<6 ";
    }
    query += "ORDER BY id_dpa ASC";
    query = client.query(query, function(err, result) {
      res.set('content-type', 'application/json; charset=UTF-8');
      if (err) {
        console.error("Error ejecutando consulta: ", err);
        res.json({"error": "Error en los parámetros"});
      } else {
        console.log("Elecciones info respuesta en formato JSON");
        res.json(result.rows);
      }
    });
  };

  listaDpas(req, res);
};

exports.dpa = dpa;