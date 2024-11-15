// controller.js
// Módulo de Controlador para manejar las interacciones entre el Modelo y la Vista

import { getUserPosition } from './model.js';

document.addEventListener('DOMContentLoaded', () => {
    const locateButton = document.getElementById('locateButton');
    const mapContainer = document.getElementById('map');

    locateButton.addEventListener('click', async () => {
        try {
            const position = await getUserPosition();
            updateMap(position.coords.latitude, position.coords.longitude);
        } catch (error) {
            alert("Error obteniendo la posición: " + error.message);
        }
    });
});

function updateMap(lat, lng) {
    // Lógica para actualizar la vista del mapa
    const map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Ubicación actual').openPopup();
}
