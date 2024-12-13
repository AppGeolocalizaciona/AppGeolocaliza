entryButton.addEventListener("click", function () {
  const logType = 1; // Log type fijo para marcar entrada
  const currentDate = new Date();
  const datetimeLog = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

  const payload = {
      employee_id: userId, // Enviar el ID del empleado
      log_type: logType, // Siempre será 1 para entrada
      datetime_log: datetimeLog, // Fecha y hora actuales
  };

  console.log("Datos enviados al servidor:", payload);

  // Enviar solicitud al servidor
  fetch("http://45.236.129.24/registerEntry.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
  })
      .then((response) => response.json())
      .then((data) => {
          console.log("Respuesta del servidor:", data);
          if (data.success) {
              alert("Entrada registrada exitosamente.");
          } else {
              alert("Error al registrar entrada: " + data.message);
          }
      })
      .catch((error) => {
          console.error("Error al conectar con el servidor:", error);
      });
});
