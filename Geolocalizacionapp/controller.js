// Modelo para manejar la posición
class PositionModel {
    constructor(targetLat, targetLong, radius) {
        this.targetLat = targetLat;
        this.targetLong = targetLong;
        this.radius = radius;
        this.isInArea = false;
        this.hasEntered = false;
    }

    updatePosition(lat, long) {
        const distance = map.distance([lat, long], [this.targetLat, this.targetLong]);
        this.isInArea = distance <= this.radius;
        return this.isInArea;
    }
}

// Controlador para manejar la lógica de interacción
class PositionController {
    constructor(model) {
        this.model = model;
        this.map = null;
        this.entryButton = document.getElementById('entryButton');
        this.exitButton = document.getElementById('exitButton');
        this.posElt = document.getElementById('Pos');
        this.rangeMessage = document.getElementById('rangeMessage');
    }

    init() {
        this.setupEventListeners();
        navigator.geolocation.watchPosition(this.geoposOK.bind(this), this.geoposKO.bind(this), {
            enableHighAccuracy: true
        });
    }

    setupEventListeners() {
        this.entryButton.addEventListener('click', this.handleEntry.bind(this));
        this.exitButton.addEventListener('click', this.handleExit.bind(this));
    }

    geoposOK(pos) {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        this.posElt.textContent = `${lat}, ${long}`;

        if (!this.map) {
            this.initMap(lat, long);
        }

        this.updateUserPosition(lat, long);
    }

    geoposKO(err) {
        const errorMsg = {
            [err.PERMISSION_DENIED]: "No has dado permiso para obtener tu posición",
            [err.POSITION_UNAVAILABLE]: "Posición no disponible",
            [err.TIMEOUT]: "Tiempo de espera excedido",
            "default": "Error desconocido"
        };
        this.posElt.textContent = errorMsg[err.code] || errorMsg["default"];
    }

    initMap(lat, long) {
        this.map = L.map('map').setView([lat, long], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        const targetArea = L.circle([this.model.targetLat, this.model.targetLong], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: this.model.radius
        }).addTo(this.map);

        L.marker([this.model.targetLat, this.model.targetLong], {
            icon: L.icon({
                iconUrl: "img/LOGO_EMPRESA.png",
                iconSize: [50, 50],
                iconAnchor: [25, 25]
            })
        }).addTo(this.map).bindPopup('Zona de Asistencia');
    }

    updateUserPosition(lat, long) {
        if (!this.map.userMarker) {
            this.map.userMarker = L.marker([lat, long]).addTo(this.map).bindPopup('Estás aquí');
        } else {
            this.map.userMarker.setLatLng([lat, long]);
        }

        if (this.model.updatePosition(lat, long)) {
            this.entryButton.style.display = 'inline-block';
            this.exitButton.style.display = 'inline-block';
            this.rangeMessage.textContent = "";
        } else {
            this.entryButton.style.display = 'none';
            this.exitButton.style.display = 'none';
            this.rangeMessage.textContent = "Fuera de rango";
        }
    }

    handleEntry() {
        if (this.model.isInArea && !this.model.hasEntered) {
            if (confirm("¿Deseas marcar tu entrada?")) {
                alert("Entrada marcada");
                this.model.hasEntered = true;
                this.disableButtons();
            }
        }
    }

    handleExit() {
        if (this.model.isInArea && this.model.hasEntered) {
            if (confirm("¿Deseas marcar tu salida?")) {
                alert("Salida marcada");
                this.model.hasEntered = false;
                this.disableButtons();
            }
        }
    }

    disableButtons() {
        this.entryButton.disabled = true;
        this.exitButton.disabled = true;
    }
}

// Inicialización del modelo y controlador
const positionModel = new PositionModel(-34.5815315, -70.9886862, 30);
const positionController = new PositionController(positionModel);
window.addEventListener('load', () => positionController.init());
