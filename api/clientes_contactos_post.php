<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

$nombre = $_POST["input-contacto-nombre"];
$apellido1 = $_POST["input-contacto-apellido1"];
$apellido2 = $_POST["input-contacto-apellido2"];
$telefono1 = $_POST["input-contacto-telefono"];
$email1 = $_POST["input-contacto-email"];
$id_Cliente = $_POST["input-contacto-cliente-id"];



$sqlClienteInsert= "INSERT INTO clientes_contactos_tb (nombre,apellido1,apellido2,telefono1,telefono2, email1,email2,cargo,observaciones,principal,id_cliente)
VALUES ('$nombre','$apellido1','$apellido2','$telefono1','','$email1','','','','',$id_Cliente)";

$respuesta = mysqli_query($conn, $sqlClienteInsert);

if ($respuesta) {
    echo json_encode("El contacto se insertó correctamente");
} else {
    echo json_encode("Hubo un problema al insertar el contacto, pta base de datos");
}

