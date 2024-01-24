<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID, X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include("conn/conexion.php");


$nombre = $_POST["input-contacto-nombre"];
$apellido1 = $_POST["input-contacto-apellido1"];
$apellido2 = $_POST["input-contacto-apellido2"];
$telefono = $_POST["input-contacto-telefono"];
$email = $_POST["input-contacto-email"];


$sqlContactoUpdate = "UPDATE contactos_tb SET
    nombre = '$nombre',
    apellido1 = '$apellido1',
    apellido2 = '$apellido2',
    telefono = '$telefono',
    email = '$email',
    WHERE id = $idContacto AND id_cliente = $idCliente";

$respuesta = mysqli_query($conn, $sqlContactoUpdate);

if ($respuesta) {
    $mensaje = "Contacto actualizado correctamente";
} else {
    $mensaje = "Hubo un problema al actualizar el contacto, send me location";
}

echo json_encode($mensaje);
?>
