<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID, X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");

include("conn/conexion.php");

$inicio = $_GET["inicio"];
$porPagina = $_GET["porpagina"];
$condicion = "";


if (isset($_GET["buscar"])) {
    $buscar = $_GET["buscar"];
    $condicion .= " WHERE (proveedores_tb.nombre LIKE '%$buscar%' OR proveedores_tb.cif LIKE '%$buscar%') ";
}

$limite = " LIMIT $inicio, $porPagina ";
$respuesta = [];

$sqlNumeroRegistros = "SELECT COUNT(*) AS numero_registros FROM proveedores_tb";
$respuestaNumerosRegistros = mysqli_query($conn, $sqlNumeroRegistros);

$fila = mysqli_fetch_assoc($respuestaNumerosRegistros);
$respuesta["numero_registros"] = $fila['numero_registros'];

$sqlProveedores = "SELECT * FROM proveedores_tb $condicion ORDER BY id DESC $limite";

$resultadoProveedores = mysqli_query($conn, $sqlProveedores);

$proveedores = [];

while ($proveedor = mysqli_fetch_assoc($resultadoProveedores)) {
    $sqlContactos = "SELECT * FROM proveedores_contactos_tb WHERE id_proveedor = " . $proveedor["id"];

    $resultadoContactos = mysqli_query($conn, $sqlContactos);
    $contactos = [];

    while($contacto = mysqli_fetch_assoc($resultadoContactos)){
        $contactos[] = $contacto;
    }

    $proveedor["contactos"] = $contactos;
    $proveedores[] = $proveedor;    
}

$respuesta["proveedores"] = $proveedores;
echo json_encode($respuesta);
?>
