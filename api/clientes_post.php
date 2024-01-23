<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

$nombre = $_POST["input-cliente-nombre"];
$cif = $_POST["input-cliente-cif"];
$telefono = $_POST["input-cliente-tlf"];
$direccion = $_POST["input-cliente-direccion"];
$idSector = $_POST["select-cliente-sector"];
$idCliente = $_POST["input-cliente-id"];

$sqlClienteInsert = "INSERT INTO `clientes_tb`(`nombre`, `cif`, `direccion`, `cp`, `provincia`, `poblacion`, `telefono`, `web`, `descripcion`, `cuenta`, `activo`, `id_sector`, `id_origen`, `id_servicio`, `id_usuario`) 
VALUES ('$nombre','$cif','$direccion','','','','$telefono','','','','1','$idSector','1','1','1')";

$respuesta = mysqli_query($conn, $sqlClienteInsert);

var_dump($respuesta);
if($respuesta){
    echo json_encode("El cliente se hizo correctamente");
}else{
    echo json_encode("No ha funcionado");
}