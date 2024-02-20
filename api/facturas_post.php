<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include("conn/conexion.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(array("success" => false, "message" => "Datos JSON no válidos"));
    exit;
}

$baseImponible = $data['baseImponible'];
$iva = $data['iva'];
$fecha_emision = $data['fecha_emision'];
$idCliente = $data['idCliente'];

$sqlFacturasInsert = "INSERT INTO `facturas_tb` (`baseimponible`, `iva`, `fecha_emision`, `id_cliente`, `id_estado`) VALUES ('$baseImponible', '$iva', '$fecha_emision', '$idCliente', '1')";

if (mysqli_query($conn, $sqlFacturasInsert)) {
    $id_factura = mysqli_insert_id($conn);
    
    foreach ($data['items'] as $item) {
        $descripcion = $item['descripcion'];
        $importe = $item['importe'];
        
        $sqlItms = "INSERT INTO `facturas_items_tb` (`descripcion`, `importe`, `id_factura`) VALUES ('$descripcion', '$importe', '$id_factura')";
        
        if (!mysqli_query($conn, $sqlItms)) {
            echo json_encode(array("success" => false, "message" => "Error al insertar items de factura"));
            exit;
        }
    }
    
    echo json_encode(array("success" => true, "message" => "Datos insertados correctamente"));
} else {
    echo json_encode(array("success" => false, "message" => "Error al insertar factura"));
}

?>
