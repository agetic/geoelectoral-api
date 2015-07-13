var express = require('express');
var elecciones = require('../controllers/elecciones');
var proxy = require('../controllers/proxy');
var dpa = require('../controllers/dpa');

var router = express.Router();

/* GET /api/v1/anios */
router.get('/anios', elecciones.anios);

/* GET /api/v1/elecciones */
router.get('/elecciones', elecciones.api);
router.get('/elecciones/dpa',elecciones.dpa);

/* GET /api/v1/elecciones/:anio/info */
router.get('/elecciones/:anio/info', elecciones.info);
router.get('/elecciones/dpa', elecciones.dpa);

/* GET /api/v1/proxy?id_tipo_dpa=2 */
router.get('/proxy', proxy.dpa);

/* GET /api/v1/dpa */
router.get('/dpa', dpa.dpa);

/* GET /api/v1/departamentos */

/* GET /api/v1/departamentos/:id_departamento/provincias */

/* GET /api/v1/departamentos/:id_departamento/circunscripciones */

/* GET /api/v1/provincias/:id_provincia/municipios */

module.exports = router;