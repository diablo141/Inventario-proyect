const db = require('../config/db');


// OBTENER PRODUCTOS
exports.obtenerProductos = (req, res) => {

    const sql = 'SELECT * FROM productos';

    db.query(sql, (error, resultados) => {

        if(error){
            return res.status(500).json(error);
        }

        res.json(resultados);
    });
};


// AGREGAR PRODUCTO
exports.crearProducto = (req, res) => {

    const {
        nombre_producto,
        descripcion,
        precio,
        stock,
        id_categoria
    } = req.body;

    const sql = `
        INSERT INTO productos
        (nombre_producto, descripcion, precio, stock, id_categoria)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre_producto, descripcion, precio, stock, id_categoria],
        (error, resultado) => {

            if(error){
                return res.status(500).json(error);
            }

            res.json({
                mensaje: 'Producto creado correctamente'
            });
        }
    );
};