// Obtener el ID del usuario de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

if (userId) {
  // Mostrar un mensaje personalizado en el dashboard
  document.getElementById("welcome-message").textContent = `Tu ID de usuario es: ${userId}`;
  console.log("Usuario conectado, ID:", userId);
  // Puedes usar este ID para cargar datos del usuario desde el servidor
} else {
  alert("No se encontró el ID del usuario. Redirigiendo al login...");
  window.location.href = "index.html"; // Redirigir al login si no hay un ID
}


  // Lógica para registrar entrada
  const entryButton = document.getElementById("entryButton");
  entryButton.addEventListener("click", function () {
    // Enviar solicitud al servidor para registrar la entrada
    fetch("/entrada.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId, // Enviar el ID del usuario
        timestamp: new Date().toISOString(), // Fecha y hora actuales
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
