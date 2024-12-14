// Obtener el ID del usuario de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

if (userId) {

  // Botón de registrar salida
  const exitButton = document.getElementById("exitButton");
  exitButton.addEventListener("click", function () {
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
  });
} else {
  alert("No se encontró el ID del usuario. Redirigiendo al login...");
  window.location.href = "index.html";
}
