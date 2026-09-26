require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/clientes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Clientes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        const { NombreCompleto, Cedula, Correo, Telefono, Saldo, TipoCuenta } = req.body;
        const pool = await poolPromise;

        await pool.request()
            .input('NombreCompleto', sql.VarChar, NombreCompleto)
            .input('Cedula', sql.VarChar, Cedula)
            .input('Correo', sql.VarChar, Correo)
            .input('Telefono', sql.VarChar, Telefono)
            .input('Saldo', sql.Decimal(12, 2), Saldo)
            .input('TipoCuenta', sql.VarChar, TipoCuenta)
            .query(`INSERT INTO Clientes (NombreCompleto, Cedula, Correo, Telefono, Saldo, TipoCuenta)
                    VALUES (@NombreCompleto, @Cedula, @Correo, @Telefono, @Saldo, @TipoCuenta)`);

        res.status(201).json({ mensaje: 'Cliente creado correctamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/api/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Saldo } = req.body;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ClienteID', sql.Int, id)
            .input('Saldo', sql.Decimal(12, 2), Saldo)
            .query('UPDATE Clientes SET Saldo = @Saldo WHERE ClienteID = @ClienteID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Saldo actualizado correctamente' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});