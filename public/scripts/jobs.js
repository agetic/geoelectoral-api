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
var obtener_jobs = function(){
  client = new pg.Client(config.app.db);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  query = "Select jobs.id_job, jobs.id_eleccion, elecciones.ano, jobs.periodo from jobs inner join elecciones on elecciones.id_eleccion = jobs.id_eleccion where activo = true;";
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
        console.log(objRow.periodo);
        generarArchivoCsv(objRow);
        //  if(objRow.periodo === now.format('HH:mm:ss')){
        //    generarArchivoCsv(objRow); //Llama a generar los archivos de cada elección
        //  }
         //console.log("nada que ejecutar");

      }
    }
  });
};

/*
** Genera un archivo csv según todos los candidatos de una elección
*/
var generarArchivoCsv = function (objRow){
  var log_info = '';
  var now = moment();
  var values = [];
  client = new pg.Client(config.app.db);
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  var crosstab = "crosstab_partidos_cols" + objRow.id_eleccion;
  query = "Select parent.nombre as Pais, nomdep as Departamento, nomprov as Provincia, municipio as Municipio, recinto as Recinto, ct.* ";
  query += "from " + crosstab + "(";
  query += "'select id_dpa, partidos.sigla, resultado from resultados inner join partidos on resultados.id_partido = partidos.id_partido where id_eleccion = "+  objRow.id_eleccion +" order by 1, 2;') AS ct ";
  query += "inner join tmp_recintosgeo on tmp_recintosgeo.recinto_dpa = ct.id_dpa ";
  query += "inner join dpa on dpa.id_dpa = CAST(tmp_recintosgeo.dep AS integer) ";
  query += "inner join dpa as parent on parent.id_dpa = dpa.id_dpa_superior "
  query += "Order by tmp_recintosgeo.nomdep, tmp_recintosgeo.nomprov, tmp_recintosgeo.municipio, tmp_recintosgeo.recinto;";
  console.log(query);
  query = client.query(query, function(err, result) {
    var nombreArchivo =  __dirname + '/elecciones_' +  objRow.ano + '.csv';
    // /var nombreArchivo = public('/scripts/elecciones_' + objRow.ano + '.csv');
    console.log("Nombre del archivo " + nombreArchivo);
    if (err) {  //Si existe un error en la consulta
      values = [objRow.id_job, 'Error al ejecutar la función crosstab', now];
      insertarJob(objRow, values);
    }
    else if(result.rows.length  > 0) { // si la consulta genera resultados
      var fieldsN = Object.keys(result.rows[0]);
      json2csv({data: result.rows, fields: fieldsN }, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(nombreArchivo, csv, function (err) {
          if (err) {
            var values = [objRow.id_job, 'No se pudo escribir el archivo.', now];
            insertarJob(objRow, values);
          }
          else{
            var values = [objRow.id_job, 'Archivo CSV generado correctamente.', now];
            insertarJob(objRow, values);
          }
        });
      });
    }
    else { //Si la consulta no genera resultados
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
