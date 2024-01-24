<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");
include ("conn/conexion.php");

INSERT INTO `clientes_tb` (`nombre`,`apellido1`,`apellido2`,`telefono1`,`telefono2`, `email1`,`email2`,`cargo`,`observaciones`,`principal`,`id_cliente`
) VALUES ('$nombre','$apellido1','$apellido2','$telefono1','','$email1','','','','','$id_cliente'
);

$respuesta = mysqli_query($conn, $sqlClienteInsert);

if ($respuesta) {
    echo json_encode("El contacto se insertó correctamente");
} else {
    echo json_encode("Hubo un problema al insertar el contacto, pta base de datos");
}

