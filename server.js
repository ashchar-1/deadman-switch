const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos volátil simulada (en memoria para pruebas locales)
let estadoSwitch = {
    activo: false,
    ultimaUbicacion: { lat: null, lng: null },
    limiteEnvio: null
};

// Endpoint para recibir la ubicación del teléfono
app.post('/api/checkin', (req, res) => {
    const { lat, lng } = req.body;
    estadoSwitch.ultimaUbicacion = { lat, lng };
    console.log(`[GPS] Ubicación recibida: Lat ${lat}, Lng ${lng}`);
    res.status(200).json({ status: "ok", message: "Ubicación actualizada" });
});

// Endpoint para activar el temporizador de emergencia
app.post('/api/switch/activar', (req, res) => {
    const { minutos } = req.body;
    estadoSwitch.activo = true;
    estadoSwitch.limiteEnvio = new Date(Date.now() + minutos * 60000);
    console.log(`[ALERT] Switch activado. Expira en ${minutos} minutos.`);
    res.status(200).json({ status: "ok", limite: estadoSwitch.limiteEnvio });
});

// Endpoint para desarmar y avisar que estás a salvo
app.post('/api/switch/desarmar', (req, res) => {
    estadoSwitch.activo = false;
    estadoSwitch.limiteEnvio = null;
    console.log("[SAFE] Sistema desarmado con éxito.");
    res.status(200).json({ status: "ok", message: "Sistema desarmado" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

