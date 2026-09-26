// Carga las variables del archivo .env
require('dotenv').config();

// Importamos express, el framework que nos permite crear la API fácilmente
const express = require('express');

// Importamos cors, que permite que el frontend (otra dirección/puerto) pueda hablar con esta API
const cors = require('cors');

// Traemos sql y poolPromise que armamos en db.js
const { sql, poolPromise } = require('./db');

// Creamos la aplicación de express
const app = express();

// Le decimos a la app que use cors (para permitir peticiones desde el frontend)
app.use(cors());

// Le decimos a la app que entienda datos en formato JSON (importante para POST/PUT más adelante)
app.use(express.json());

// Ruta GET: cuando alguien visite /api/clientes, se ejecuta esta función
app.get('/api/clientes', async (req, res) => {
    try {
        // Esperamos a que el pool de conexión esté listo
        const pool = await poolPromise;

        // Hacemos la consulta SQL para traer todos los clientes
        const result = await pool.request().query('SELECT * FROM Clientes');

        // Enviamos el resultado como JSON al que hizo la petición
        res.json(result.recordset);
    } catch (err) {
        // Si algo sale mal, enviamos un error con código 500 (error de servidor)
        res.status(500).send(err.message);
    }
});


// Ruta POST: crea un cliente nuevo cuando llega información en el body de la petición
app.post('/api/clientes', async (req, res) => {
    try {
        // Sacamos los datos que vienen en el body de la petición (lo que envía el usuario/Thunder Client)
        const { NombreCompleto, Cedula, Correo, Telefono, Saldo, TipoCuenta } = req.body;

        // Esperamos a que el pool de conexión esté listo
        const pool = await poolPromise;

        // Insertamos el nuevo cliente, usando "inputs" para evitar inyección SQL
        // (nunca metas los valores directo en el texto del query, siempre usa .input())
        const result = await pool.request()
            .input('NombreCompleto', sql.VarChar, NombreCompleto)
            .input('Cedula', sql.VarChar, Cedula)
            .input('Correo', sql.VarChar, Correo)
            .input('Telefono', sql.VarChar, Telefono)
            .input('Saldo', sql.Decimal(12, 2), Saldo)
            .input('TipoCuenta', sql.VarChar, TipoCuenta)
            .query(`INSERT INTO Clientes (NombreCompleto, Cedula, Correo, Telefono, Saldo, TipoCuenta)
                    VALUES (@NombreCompleto, @Cedula, @Correo, @Telefono, @Saldo, @TipoCuenta)`);

        // Respondemos confirmando que se creó correctamente
        res.status(201).json({ mensaje: 'Cliente creado correctamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Ruta PUT: actualiza el saldo de un cliente específico (depósito o retiro)
app.put('/api/clientes/:id', async (req, res) => {
    try {
        // El ID viene en la URL (ej: /api/clientes/3), lo sacamos de req.params
        const { id } = req.params;

        // El nuevo saldo viene en el body de la petición
        const { Saldo } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('ClienteID', sql.Int, id)
            .input('Saldo', sql.Decimal(12, 2), Saldo)
            .query('UPDATE Clientes SET Saldo = @Saldo WHERE ClienteID = @ClienteID');

        // rowsAffected nos dice cuántas filas cambió el UPDATE — si es 0, el ID no existía
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Saldo actualizado correctamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Ruta DELETE: elimina un cliente específico según su ID
app.delete('/api/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ClienteID', sql.Int, id)
            .query('DELETE FROM Clientes WHERE ClienteID = @ClienteID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Definimos en qué puerto va a correr el servidor
const PORT = 3000;

// Encendemos el servidor y mostramos un mensaje confirmando que está corriendo
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});