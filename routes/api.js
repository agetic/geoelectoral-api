var express = require('express');
var elecciones = require('../controllers/elecciones');
var proxy = require('../controllers/proxy');

var router = express.Router();

/* GET /api/v1/anios */
router.get('/anios', elecciones.anios);

/* GET /api/v1/elecciones */
router.get('/elecciones', elecciones.api);

/* GET /api/v1/elecciones/:anio/info */
router.get('/elecciones/:anio/info', elecciones.info);

/* GET /api/v1/proxy?id_tipo_dpa=2 */
router.get('/proxy', proxy.dpa);

/* GET /api/v1/departamentos */

/* GET /api/v1/departamentos/:id_departamento/provincias */

/* GET /api/v1/departamentos/:id_departamento/circunscripciones */

/* GET /api/v1/provincias/:id_provincia/municipios */

module.exports = router;