// Obtener el ID del usuario de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

if (userId) {
  document.getElementById("welcome-message").textContent = `Tu ID de usuario es: ${userId}`;

  // Lógica para registrar entrada
  const entryButton = document.getElementById("entryButton");
  entryButton.addEventListener("click", function () {
    const logType = 1; // Log type fijo para marcar entrada
    const datetimeLog = new Date().toISOString().slice(0, 19).replace("T", " "); // Formato YYYY-MM-DD HH:MM:SS

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
  });
} else {
  alert("No se encontró el ID del usuario. Redirigiendo al login...");
  window.location.href = "index.html";
}
