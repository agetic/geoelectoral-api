var express = require('express');
var elecciones = require('../lib/elecciones');

var router = express.Router();

/* GET /api/v1/elecciones */
router.get('/elecciones', elecciones.api);

module.exports = router;