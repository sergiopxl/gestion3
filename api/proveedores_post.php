<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");

include("conn/conexion.php");

// Defino las variables que quiero mandar a la base de datos
$nombre = $_POST["input-proveedor-nombre"];
$cif = $_POST["input-proveedor-cif"];
$telefono = $_POST["input-proveedor-tlf"];
$direccion = $_POST["input-proveedor-direccion"];
$servicio = $_POST["select-proveedor-servicio"];

//hago la consulta quu se ejecutara luego

$sqlProveedorInsert = "INSERT INTO `proveedores_tb`(`nombre`, `cif`, `direccion`, `cp`, `provincia`, `poblacion`, `telefono`, `web`, `descripcion`, `id_servicio`)
                        VALUES ('$nombre', '$cif', '$direccion', '', '', '', '$telefono', '', '', $servicio)";

//Ejecuto la consulta
$respuesta = mysqli_query($conn, $sqlProveedorInsert);

//Compruebo si la ejecucion de la consulta se ha hecho bien
if($respuesta){
    echo json_encode("El cliente se hizo correctamente");
}else{
    echo json_encode("No ha funcionado");
}