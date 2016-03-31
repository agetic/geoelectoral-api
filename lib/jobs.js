var config = require('konfig')();
var json2csv = require('json2csv');
var moment = require('moment');
var fs = require('fs');
var pg = require('pg')
  , client
  , query;

/*
** Obtiene todos los jobs activos y pregunta, porsteriormente, por aquellos que necesitan ser ejectuados
*/
var obtener_jobs = function(callback){
  client = new pg.Client(config.app.db);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  query = "Select jobs.id_job, jobs.id_eleccion, elecciones.ano, jobs.periodo, elecciones.id_tipo_eleccion from jobs inner join elecciones on elecciones.id_eleccion = jobs.id_eleccion where activo = true;";
  query = client.query(query, function(err, result){
    if(err){
      console.log("Error al obtener las tareas programadas");
    }
    else{
      for (var i = 0, l = result.rows.length; i < l; i++) {
        var objRow = result.rows[i];
        var objEleccion = objRow.id_eleccion;
        var objAno = objRow.ano;
        var now = moment();
         if(objRow.periodo === now.format('HH:mm:ss')){
           console.log('do it!');
           generarArchivoCsv(objRow); //Llama a generar los archivos de cada elección
         }
      }
    }
  });
};

/*
** Genera un archivo csv según todos los candidatos de una elección
*/
var generarArchivoCsv = function (objRow, callback){
  var log_info = '';
  var now = moment();
  var values = [];
  client = new pg.Client(config.app.db);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  var crosstab = "crosstab_partidos_cols" + objRow.id_eleccion;
  query_ant = "select query_datos_completos(" + objRow.id_eleccion + ")::text AS resultado";
  console.log(query_ant);
  var query_string = '';
  query_ant = client.query(query_ant, function (err, result){
    if(err)
      console.log(err);
    else {
      query = result.rows[0].resultado;
      //console.log(query);
    }
  });
  query = client.query(query, function(err, result) {
    var nombreArchivo =  __dirname + '/../public/elecciones_' +  objRow.ano + '_' +objRow.id_tipo_eleccion+ '.csv';
    console.log("entro");
    if (err) {  //Si existe un error en la consulta
      console.log("error en la consulta cross");
      values = [objRow.id_job, 'Error al ejecutar la función crosstab', now];
      insertarJob(objRow, values);
    }
    else if(result.rows.length  > 0) { // si la consulta genera resultados
      var fieldsN = Object.keys(result.rows[0]);
      console.log('Ya hay result');
      json2csv({data: result.rows, fields: fieldsN }, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(nombreArchivo, csv, function (err) {
          if (err) {
            console.log('No se pudo archivo');
            var values = [objRow.id_job, 'No se pudo escribir el archivo.', now];
            insertarJob(objRow, values);
          }
          else{
            console.log('Correcto');
            var values = [objRow.id_job, 'Archivo CSV generado correctamente.', now];
            insertarJob(objRow, values);
          }
        });
      });
    }
    else { //Si la consulta no genera resultados
      console.log("no generó res.");
      var values = [objRow.id_job, 'La consulta crosstab no generó resultados. Es posible que no exista relación entre las tabla de información georeferencial y la tabla de resultados', now];
      insertarJob(objRow, values);
    }
  });
};

var insertarJob = function (objRow, values){
  client = new pg.Client(config.app.db);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  query = 'INSERT INTO job_det (id_job, log, fecha) VALUES ($1, $2, $3)';
  client.query(query, values, function(err, result){
    if(err) console.log(err);
  });
}

exports.obtener_jobs = obtener_jobs;
