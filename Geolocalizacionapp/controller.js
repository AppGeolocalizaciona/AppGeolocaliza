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
        const userLatLng = L.latLng(lat, long);
        const targetLatLng = L.latLng(this.targetLat, this.targetLong);
        const distance = userLatLng.distanceTo(targetLatLng);
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

        // Añade un pequeño retraso para invalidar el tamaño del mapa y asegurar la visualización correcta
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);

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

        const userLatLng = L.latLng(lat, long);
        const targetLatLng = L.latLng(this.model.targetLat, this.model.targetLong);
        const distance = userLatLng.distanceTo(targetLatLng);

        if (distance <= this.model.radius) {
            this.entryButton.style.display = 'inline-block';
            this.exitButton.style.display = 'inline-block';
            this.rangeMessage.textContent = "";
            this.model.isInArea = true;
            this.entryButton.disabled = this.model.hasEntered;
            this.exitButton.disabled = !this.model.hasEnte
            
        } else {
            this.entryButton.style.display = 'none';
            this.exitButton.style.display = 'none';
            this.rangeMessage.textContent = "Fuera de rango";
            this.model.isInArea = false;
        }
    }

    handleEntry() {
        if (this.model.isInArea && !this.model.hasEntered) {
            if (confirm("¿Deseas marcar tu entrada?")) {
                alert("Entrada marcada");
                this.model.hasEntered = true;
                this.entryButton.disabled = true;
                this.exitButton.disabled = false;
            }
        }
    }

    handleExit() {
        if (this.model.isInArea && this.model.hasEntered) {
            if (confirm("¿Deseas marcar tu salida?")) {
                alert("Salida marcada");
                this.model.hasEntered = false;
                this.entryButton.disabled = false;
                this.exitButton.disabled = true;
               
            }
        }
    }

    disableButtons() {
        this.entryButton.disabled = true;
        this.exitButton.disabled = true;
    }
}

// Inicialización del modelo y controlador
const positionModel = new PositionModel(-34.5815315, -70.9886862, 40);
const positionController = new PositionController(positionModel);
window.addEventListener('load', () => positionController.init());

// Lógica para el login
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validar que los campos no estén vacíos
    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Enviar datos al servidor para el login
    fetch("/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Inicio de sesión exitoso: Bienvenido " + data.user.username);
                // Redirigir al dashboard o página principal
                //window.location.href = "dashboard.html";
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error al conectar con el servidor:", error);
        });
});
