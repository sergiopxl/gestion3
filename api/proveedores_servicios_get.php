<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");

include("conn/conexion.php");

$sqlServicios = "SELECT * FROM proveedores_servicios_tb"; // Modificar la consulta para obtener datos de la tabla correcta
$resultadoServicios = mysqli_query($conn, $sqlServicios);
$servicios = [];

while ($servicio = mysqli_fetch_assoc($resultadoServicios)) {
    $servicios[] = $servicio;
}

echo json_encode($servicios);
