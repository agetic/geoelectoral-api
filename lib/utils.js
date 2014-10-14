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
          partido_nombre: elem.partido_nombre,
          sigla: elem.sigla,
          resultado: elem.resultado,
          observacion: elem.observacion,
          porcentaje: elem.porcentaje,
          color: elem.color
        });
        elem = rows.shift();
      } else {
        dpa = {
          id_dpa: elem.id_dpa,
          dpa_codigo: elem.dpa_codigo,
          dpa_nombre: elem.dpa_nombre,
          id_dpa_superior: elem.id_dpa_superior,
          partidos: []
        };
        dpaActual = elem;
        jsonObj['dpas'].push(dpa);
      }
    }
  }
  return jsonObj;
};

/**
 * Genera un objecto JSON con la estructura:
 * { eleccion: {...}, dpas: [] }
 * La condición es que el parámetro rows este ordenado por las DPA
 * @param {Array} rows
 * @return {JSON} jsonObj
 */
var elecciones_info_json = function(rows) {
  var jsonObj;

  jsonObj = {
    links: {
      "partidos_referencia.partidos": {
        href: 'http://test.geo.gob.bo/geoelectoral-api/api/v1/partidos/{partidos_referencia.partidos}',
        type: "partidos"
      }
    },
    partidos_referencia: [
      {
        id: 83,
        nombre: 'INSCRITOS',
        links: {
          partidos: [23, 24, 25]
        }
      },
      {
        id: 84,
        nombre: 'EMITIDOS',
        partidos: [23, 24]
      },
      {
        id: 85,
        nombre: 'VALIDOS',
        partidos: [24,25]
      }
    ],
    elecciones: [
      {
        id: 1,
        anio: 2009,
        nombre: 'Votos para presidente'
      }, {
        id: 2,
        anio: 2009,
        nombre: 'Votos circ. uninominales'
      }, {
        id: 3,
        anio: 2009,
        nombre: 'Votos circ. especiales'
      }
    ],
    tipos_resultados: [
      {
        id: 1,
        nombre: 'Nº Votos'
      }, {
        id: 2,
        nombre: 'Nº Diputados'
      }, {
        id: 3,
        nombre: 'Nº Senadores'
      }
    ],
    linked: {
      partidos: [
        {
          id: 23,
          sigla: 'AS'
        }, {
          id: 24,
          sigla: 'BSD'
        }, {
          id: 25,
          sigla: 'MAS'
        }
      ]
    }
  };

  return jsonObj;
};

/**
 * Convertir años en un array:
 * { anios: [1979, ..., 2009] } *
 * @param {Array} rows
 * @return {JSON} jsonObj
 */
var array_anios_json = function(rows) {
  var jsonObj;

  jsonObj = { anios: [] };
  rows.forEach(function(r) {
    jsonObj['anios'].push(parseInt(r.anio));
  });

  return jsonObj;
};

exports.eleccion_dpas_json = eleccion_dpas_json;
exports.elecciones_info_json = elecciones_info_json;
exports.array_anios_json = array_anios_json;
