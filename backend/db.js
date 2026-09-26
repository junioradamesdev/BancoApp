require('dotenv').config();
const sql = require('mssql'); 

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,  // encrypt: true is required for this SQL Server setup to negotiate the connection successfully
encrypt: true,
        trustServerCertificate: true 
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado a a la base de datos');
        return pool;
    })
    .catch(err => console.error('❌ Error de conexión:', err));


module.exports = {
    sql, poolPromise
};