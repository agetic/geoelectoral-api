/**
 * Genera un objecto JSON con la estructura:
 * { eleccion: {...}, dpas: [] }
 * La condición es que el parámetro rows este ordenado por las DPA
 * @param {Array} rows
 * @return {JSON} jsonObj
 */
var eleccion_dpas_json = function(rows) {
  var jsonObj, elem, dpaActual, dpa;

  jsonObj = {};
  elem = rows.shift();

  if (elem) {
    // Datos de la elección
    jsonObj['eleccion'] = {
      id_eleccion: elem.id_eleccion,
      anio: elem.anio,
      nombre_tipo_resultado: elem.nombre_tipo_resultado
    };

    // Datos de los DPAs
    jsonObj['dpas'] = [];
    dpaActual = {};
    while (elem) {
      if (elem.id_dpa === dpaActual.id_dpa) {
        dpa['partidos'].push({
          id_partido: elem.id_partido,
          id_tipo_partido: elem.id_tipo_partido,
          sigla: elem.sigla,
          resultado: elem.resultado,
          porcentaje: elem.porcentaje
        });
        elem = rows.shift();
      } else {
        dpa = {
          id_dpa: elem.id_dpa,
          dpa_codigo: elem.dpa_codigo,
          dpa_nombre: elem.dpa_nombre,
          partidos: []
        };
        dpaActual = elem;
        jsonObj['dpas'].push(dpa);
      }
    }
  }
  return jsonObj;
};

exports.eleccion_dpas_json = eleccion_dpas_json;