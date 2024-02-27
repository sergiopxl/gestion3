<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include("conn/conexion.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(array("success" => false, "message" => "Datos JSON no válidos"));
    exit;
}

$idItem = $data['id'];
echo json_encode($idItem);
$sqlItems = "DELETE FROM `facturas_items_tb` WHERE id = ". $idItem;


if (mysqli_query($conn, $sqlItems)){
    echo json_encode("Datos insertados correctamente");
}else{
    echo json_encode("Error al insertar factura");
}

?>