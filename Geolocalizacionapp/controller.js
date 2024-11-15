/** @type {HTMLElement} */
var posElt;
/** @type {HTMLElement} */
var posLinkElt;
/** @type {L.Map} */
var map;
/** @type {L.Circle} */
var targetArea;
/** @type {HTMLElement} */
var entryButton;
/** @type {HTMLElement} */
var exitButton;

// Coordenadas objetivo
const targetLat =  -34.5815315;
const targetLong = -70.9886862;
const targetRadius = 30;
let isInArea = false;
let hasEntered = false;

window.addEventListener('load', function () {
    posElt = document.getElementById('Pos');
    posLinkElt = document.querySelector('#PosLink > a');
    entryButton = document.getElementById('entryButton');
    exitButton = document.getElementById('exitButton');

    entryButton.addEventListener('click', handleEntry);
    exitButton.addEventListener('click', handleExit);

    navigator.geolocation.watchPosition(geoposOK, geoposKO, {
        enableHighAccuracy: true
    });
});

/** @param {GeolocationPosition} pos */
function geoposOK(pos) {
    var lat = pos.coords.latitude;
    var long = pos.coords.longitude;

    posElt.textContent = `${lat}, ${long}`;
   /** posLinkElt.href = `https://maps.google.com/?q=${lat},${long}`;
    posLinkElt.textContent = 'Mostrar tu posición en un mapa';*/

    if (!map) {
        initMap(lat, long);
    }

    updateUserPosition(lat, long);
}

/** @param {GeolocationPositionError} err */
function geoposKO(err) {
    let msg;
    switch (err.code) {
        case err.PERMISSION_DENIED:
            msg = "No nos has dado permiso para obtener tu posición";
            break;
        case err.POSITION_UNAVAILABLE:
            msg = "Tu posición actual no está disponible";
            break;
        case err.TIMEOUT:
            msg = "No se ha podido obtener tu posición en un tiempo prudencial";
            break;
        default:
            msg = "Error desconocido";
            break;
    }
    posElt.textContent = msg;
}

function initMap(lat, long) {
    map = L.map('map').setView([lat, long], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    targetArea = L.circle([targetLat, targetLong], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: targetRadius
    }).addTo(map);

    // Marcador personalizado con logo
    const logoIcon = L.icon({
        iconUrl: "img/LOGO_EMPRESA.png",
        iconSize: [50, 50], // Ajusta el tamaño
        iconAnchor: [25, 25],
        popupAnchor: [0, -25]
    });

    L.marker([targetLat, targetLong], {
            icon: logoIcon
        }).addTo(map)
        .bindPopup('Zona de Asistencia');
}

function updateUserPosition(lat, long) {
    if (!map.userMarker) {
        map.userMarker = L.marker([lat, long]).addTo(map).bindPopup('Estás aquí');
    } else {
        map.userMarker.setLatLng([lat, long]);
    }

    checkProximity(lat, long);
}

function checkProximity(lat, long) {
    const distance = map.distance([lat, long], [targetLat, targetLong]);

    if (distance <= targetRadius) {
        entryButton.style.display = 'inline-block'; // Mostrar botones
        exitButton.style.display = 'inline-block'; // Mostrar botones
        entryButton.disabled = false;
        exitButton.disabled = false;
        isInArea = true;
        rangeMessage.textContent = ""; // Limpiar el mensaje si está dentro del rango
    } else {
        entryButton.style.display = 'none'; // Ocultar botones
        exitButton.style.display = 'none'; // Ocultar botones
        entryButton.disabled = true;
        exitButton.disabled = true;
        isInArea = false;
        rangeMessage.textContent = "Fuera de rango"; // Mostrar mensa
    }
}

function handleEntry() {
    if (isInArea && !hasEntered) {
        if (confirm("¿Deseas marcar tu entrada?")) {
            alert("Entrada marcada");
            hasEntered = true;
            disableButtons();
        }
    }
}

function handleExit() {
    if (isInArea && hasEntered) {
        if (confirm("¿Deseas marcar tu salida?")) {
            alert("Salida marcada");
            hasEntered = false;
            disableButtons();
        }
    }
}

function disableButtons() {
    entryButton.disabled = true;
    exitButton.disabled = true;
}


function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu) {
        menu.classList.toggle("visible");
        menu.classList.toggle("hidden");
    }
}
