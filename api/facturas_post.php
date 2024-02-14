<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

$data = json_decode(file_get_contents('php://input'), true);

$


$sqlFacturasInsert = "INSERT INTO 
`facturas_tb`
(`baseimponible`,`iva`, `descripcion`, `fecha_emision`, `fecha_envio`, `fecha_pago`, `id_cliente`, `id_estado`) 
VALUES 
('[value-2]','[value-4]','','[value-6]','0000-00-00','0000-00-00]','[value-9]','1')";

$respuesta = mysqli_query($conn,$sqlFacturasInsert);    

$sqlItms = "INSERT INTO 
`facturas_items_tb`(`descripcion`, `cantidad`, `importe`, `tipo`, `id_factura`) 
VALUES 
('[value-1]','[value-2]','1','[value-4]','1','[value-6]')";