var express = require('express');
var elecciones = require('../controllers/elecciones');

var router = express.Router();

/* GET /api/v1/elecciones */
router.get('/elecciones', elecciones.api);

module.exports = router;