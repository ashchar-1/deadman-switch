const btnPanic = document.getElementById('btn-panic');
const btnSafe = document.getElementById('btn-safe');
const statusLight = document.getElementById('status-light');
const statusText = document.getElementById('status-text');
const gpsDisplay = document.getElementById('gps-display');

let watchId = null;

// Iniciar rastreo de ubicación nativo usando la API del navegador
if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            gpsDisplay.innerText = `GPS Activo: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            
            // Enviar coordenadas al servidor backend
            fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: latitude, lng: longitude })
            }).catch(err => console.log("Error enviando coordenadas:", err));
        },
        (error) => { gpsDisplay.innerText = "Error al obtener GPS."; },
        { enableHighAccuracy: true }
    );
}

// Evento: Activar Modo Sismo
btnPanic.addEventListener('click', async () => {
    const res = await fetch('/api/switch/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutos: 5 })
    });
    const data = await res.json();
    if(data.status === "ok") {
        statusLight.className = "light status-on";
        statusText.innerText = "CONTEO REGRESIVO ACTIVADO (5 MIN)";
        btnPanic.disabled = true;
        btnSafe.disabled = false;
    }
});

// Evento: Desarmar (Estoy a salvo)
btnSafe.addEventListener('click', async () => {
    const res = await fetch('/api/switch/desarmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    const data = await res.json();
    if(data.status === "ok") {
        statusLight.className = "light status-off";
        statusText.innerText = "Sistema Inactivo - A Salvo";
        btnPanic.disabled = false;
        btnSafe.disabled = true;
    }
});

