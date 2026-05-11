const express = require('express');
const cors = require('cors');

const productosRoutes = require('./routes/productosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);

module.exports = app;