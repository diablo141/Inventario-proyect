const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "Pablo.141",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((error) => {
    if(error){
        console.log('Error de conexión:', error);
    } else {
        console.log('MySQL conectado');
    }
});

module.exports = connection;