const express = require('express');

const router = express.Router();

const productosController =
require('../controllers/productosController');


// GET
router.get('/', productosController.obtenerProductos);


// POST
router.post('/', productosController.crearProducto);


module.exports = router;