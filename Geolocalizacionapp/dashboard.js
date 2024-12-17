// Obtener el ID del usuario de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

if (userId) {
  // Función para registrar entrada
  const registerEntry = () => {
    const logType = 1; // Log type fijo para marcar entrada
    const currentDate = new Date();
    const datetimeLog = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

    // Enviar solicitud al servidor para registrar la entrada
    fetch("/entrada.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id: userId, // Enviar el ID del empleado
        log_type: logType, // Siempre será 1 para entrada
        datetime_log: datetimeLog, // Fecha y hora actuales
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Entrada registrada exitosamente.");
          console.log("Detalles de entrada:", data);
        } else {
          alert("Error al registrar entrada: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error);
      });
  };

  // Función para registrar salida
  const registerExit = () => {
    const logType = 2; // Log type fijo para marcar salida
    const currentDate = new Date();
    const datetimeLog = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

    // Enviar solicitud al servidor para registrar la salida
    fetch("/salida.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id: userId, // Enviar el ID del empleado
        log_type: logType, // Siempre será 2 para salida
        datetime_log: datetimeLog, // Fecha y hora actuales
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Salida registrada exitosamente.");
          console.log("Detalles de salida:", data);
        } else {
          alert("Error al registrar salida: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error);
      });
  };

  // Asociar eventos a los botones
  const entryButton = document.getElementById("entryButton");
  const exitButton = document.getElementById("exitButton");

  if (entryButton) {
    entryButton.addEventListener("click", registerEntry);
  }

  if (exitButton) {
    exitButton.addEventListener("click", registerExit);
  }
} else {
  alert("No se encontró el ID del usuario. Redirigiendo al login...");
  window.location.href = "index.html";
}
function logout() {
  window.location.href = '/login.html';
}
