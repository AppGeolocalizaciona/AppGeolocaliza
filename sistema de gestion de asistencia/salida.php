<?php
header("Access-Control-Allow-Origin: *"); // Permitir acceso desde cualquier origen
header("Content-Type: application/json; charset=UTF-8");

$servername = "45.236.129.24";
$username = "admin";
$password = "admin";
$dbname = "payroll";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array("error" => "Conexión fallida: " . $conn->connect_error)));
}

// Leer datos enviados por el front-end
$data = json_decode(file_get_contents("php://input"));

if (isset($data->employee_id) && isset($data->log_type) && isset($data->datetime_log)) {
    $employee_id = $conn->real_escape_string($data->employee_id);
    $log_type = $conn->real_escape_string($data->log_type);
    $datetime_log = $conn->real_escape_string($data->datetime_log);

    // Verificar si el status del empleado es diferente de 0
    $statusCheckQuery = "SELECT status FROM employee WHERE id = '$employee_id'";
    $statusCheckResult = $conn->query($statusCheckQuery);

    if ($statusCheckResult && $statusCheckResult->num_rows > 0) {
        $row = $statusCheckResult->fetch_assoc();
        if ($row['status'] == 0) {
            echo json_encode(array("success" => false, "message" => "El empleado ya registró su salida."));
            $conn->close();
            exit();
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Empleado no encontrado."));
        $conn->close();
        exit();
    }

    // Insertar el registro en la tabla attendance
    $insertQuery = "INSERT INTO `attendance` (`employee_id`, `log_type`, `datetime_log`) VALUES ('$employee_id', '$log_type', '$datetime_log')";

    if ($conn->query($insertQuery) === TRUE) {
        // Actualizar el status del empleado a 0
        $updateStatusQuery = "UPDATE employee SET status = 0 WHERE id = '$employee_id'";
        $conn->query($updateStatusQuery);

        echo json_encode(array("success" => true, "message" => "Salida registrada exitosamente"));
    } else {
        echo json_encode(array("success" => false, "message" => "Error al registrar salida: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Datos incompletos"));
}

$conn->close();
?>
