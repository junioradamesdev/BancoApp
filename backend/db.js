// Carga las variables del archivo .env (usuario, contraseña, etc.) para poder usarlas aquí
require('dotenv').config();
const sql = require('mssql'); // Importamos la librería mssql, que nos permite conectar Node con SQL Server

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,  // no usamos cifrado porque es conexión local, no en la nube
        trustServerCertificate: true // confía en el certificado local sin verificarlo (ok para desarrollo)
    }
};

// Creamos un "pool" de conexiones: en vez de abrir/cerrar una conexión cada vez,
// mantenemos varias listas para usar cuando lleguen peticiones (más eficiente)
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado a a la base de datos');
        return pool;
    })
    .catch(err => console.error('❌ Error de conexión:', err));


// Exportamos sql y poolPromise para poder usarlos en otros archivos (como server.js)
module.exports = {
    sql, poolPromise
};