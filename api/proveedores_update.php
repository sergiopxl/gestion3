<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

$nombre = $_POST["input-proveedor-nombre"];
$cif = $_POST["input-proveedor-cif"];
$telefono = $_POST["input-proveedor-tlf"];
$direccion = $_POST["input-proveedor-direccion"];
$idServicio = $_POST["select-proveedor-servicio"];
$idProveedor = $_POST["input-proveedor-id"];


$sqlProveedorUpdate = "UPDATE proveedores_tb SET
nombre= '$nombre',
cif= '$cif',
telefono = '$telefono',
direccion = '$direccion',
id_servicio = '$idServicio' WHERE id=$idProveedor";
$respuesta = mysqli_query($conn, $sqlProveedorUpdate);

if($respuesta){
    $mensaje = "Registro actalizado correctamente";
}else{
    $mensaje = "Tienes un problema";
}

echo json_encode($mensaje);