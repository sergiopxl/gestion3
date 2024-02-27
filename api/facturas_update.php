<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include("conn/conexion.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(array("success" => false, "message" => "Datos JSON no válidos"));
    exit;
}

$nombre = []