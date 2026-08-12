const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3002; // Puerto del dashboard

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy para obtener eventos (lista de eventos disponibles)
app.get('/api/eventos', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/evento');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
});

// Proxy para obtener asientos de un evento
app.get('/api/asientos/:eventoId', async (req, res) => {
    try {
        const { eventoId } = req.params;
        const response = await axios.get(`http://localhost:3000/asientos/evento/${eventoId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener asientos' });
    }
});

app.listen(PORT, () => {
    console.log(`Dashboard corriendo en http://localhost:${PORT}`);
});