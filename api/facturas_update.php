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
$idFactura = $data['idFactura'];

$sqlFacturasUpdate = "UPDATE `facturas_tb` SET `baseimponible`=$baseImponible,`iva`=$iva, `fecha_emision`='$fecha_emision',`id_cliente`='$idCliente' WHERE id = $idFactura";

if(mysqli_query($conn, $sqlFacturasUpdate)) {
    foreach ($data['items'] as $item) {
        $descripcion = $item['descripcion'];
        $importe = $item['importe'];
        $idItem = $item['idItem'];

        if($idItem != 0){
        
            $sqlItms = "UPDATE `facturas_items_tb` SET `descripcion`='$descripcion',`importe`='$importe' WHERE id = $idItem";
        }else{
            $sqlItms = "INSERT INTO `facturas_items_tb`( `descripcion`, `cantidad`, `importe`, `tipo`, `id_factura`) 
                                                VALUES ('$descripcion','','$importe','','$idFactura')";
        }
        
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