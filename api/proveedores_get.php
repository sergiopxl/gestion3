<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID, X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");

include("conn/conexion.php");

$inicio = isset($_GET["inicio"]) ? $_GET["inicio"] : 0;
$porPagina = isset($_GET["porpagina"]) ? $_GET["porpagina"] : 10; 
$condicion = " WHERE proveedores_tb.activo = 1 ";

if (isset($_GET["buscar"])) {
    $buscar = $_GET["buscar"];
    $condicion .= " AND (proveedores_tb.nombre LIKE '%$buscar%' OR proveedores_tb.cif LIKE '%$buscar%') ";
}

$limite = " LIMIT $inicio, $porPagina ";
$respuesta = [];

$sqlNumeroRegistros = "SELECT COUNT(*) AS numero_registros FROM proveedores_tb WHERE activo = 1";
$respuestaNumerosRegistros = mysqli_query($conn, $sqlNumeroRegistros);

$fila = mysqli_fetch_assoc($respuestaNumerosRegistros);
$respuesta["numero_registros"] = $fila['numero_registros'];

$sqlProveedores = "SELECT * FROM proveedores_tb $condicion ORDER BY id DESC $limite";

$resultadoProveedores = mysqli_query($conn, $sqlProveedores);

$proveedores = [];

while ($proveedor = mysqli_fetch_assoc($resultadoProveedores)) {
    $proveedores[] = $proveedor;
}

$respuesta["proveedores"] = $proveedores;
echo json_encode($respuesta);
?>
