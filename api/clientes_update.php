<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

$nombre = $_POST["input-cliente-nombre"];
$cif = $_POST["input-cliente-cif"];
$telefono = $_POST["input-cliente-cif"];
$direccion = $_POST["input-cliente-cif"];
$idSector = $_POST["input-cliente-cif"];
$idCliente = $_POST["input-cliente-cif"];

$sqñClienteUpdate = "UPDATE clientes_tb SET
nombre= '$nombre',
cif= '$cif',
telefono = '$telefono',
direccion = '$direccion',
id_sector = '$idSector' WHERE id=$idCliente";
$respuesta = mysqli_query($conn, $sqliClientesUpdate);

if($respuesta){
    $mensaje = "Registro actalizado correctamente";
}else{
    $mensaje = "Tienes un problema";
}

echo json_encode($mensaje);