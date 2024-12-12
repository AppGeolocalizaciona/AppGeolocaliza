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
