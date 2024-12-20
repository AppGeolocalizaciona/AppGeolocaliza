<?php
header("Access-Control-Allow-Origin: *"); // Permitir acceso desde cualquier origen
header("Content-Type: application/json; charset=UTF-8");

// Configuración de conexión
$servername = "45.236.129.24";
$username = "admin";
$password = "admin";
$dbname = "payroll";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(array("error" => "Conexión fallida: " . $conn->connect_error)));
}

// Leer datos enviados por el front-end
$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $username = $conn->real_escape_string($data->username);
    $password = $conn->real_escape_string($data->password);

    // Consulta a la tabla 'user'
    $sql = "SELECT * FROM employee WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(array("success" => true, "message" => "Login exitoso", "user" => $user));
    } else {
        echo json_encode(array("success" => false, "message" => "Nombre de usuario o contraseña incorrectos"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Faltan datos de usuario o contraseña"));
}

$conn->close();
?>
