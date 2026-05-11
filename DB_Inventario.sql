CREATE DATABASE gestion_tienda;
USE gestion_tienda;

-- Tabla para usuarios del sistema--
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para categorías de productos--
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla para productos en el inventario--
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    stock_minimo INT DEFAULT 10,
    id_categoria INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_categoria)
    REFERENCES categorias(id_categoria)
);

-- Tabla para proveedores de productos--
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255)
);

-- Tabla intermedia para la relación muchos a muchos entre productos y proveedores--
CREATE TABLE producto_proveedor (
    id_producto INT,
    id_proveedor INT,

    PRIMARY KEY (id_producto, id_proveedor),

    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto),

    FOREIGN KEY (id_proveedor)
    REFERENCES proveedores(id_proveedor)
);
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_venta DECIMAL(10,2) NOT NULL
);

-- Detalle de ventas para registrar los productos vendidos en cada venta--
CREATE TABLE detalle_ventas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_venta)
    REFERENCES ventas(id_venta),

    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
);

-- Tabla para registrar las notificaciones del sistema--
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    mensaje TEXT NOT NULL,
    fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'leida') DEFAULT 'pendiente'
);

-- Ver productos con bajo stock--
SELECT nombre_producto, stock
FROM productos
WHERE stock <= stock_minimo;

-- Ver las ganancias del día--
SELECT SUM(total_venta) AS ganancias_dia
FROM ventas
WHERE DATE(fecha_venta) = CURDATE();

-- Productos más vendidos--
SELECT p.nombre_producto,
       SUM(dv.cantidad) AS total_vendidos
FROM detalle_ventas dv
JOIN productos p
ON dv.id_producto = p.id_producto
GROUP BY p.nombre_producto
ORDER BY total_vendidos DESC;

-- Productos por categorias--
SELECT c.nombre_categoria,
       COUNT(p.id_producto) AS cantidad_productos
FROM categorias c
LEFT JOIN productos p
ON c.id_categoria = p.id_categoria
GROUP BY c.nombre_categoria;