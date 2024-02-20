<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");

include("conn/conexion.php");


$condicion = " WHERE activo = 1 ";
$limite = "";

if (isset($_GET["buscar"])) {
    $buscar = $_GET["buscar"];
    $condicion = " WHERE activo = 1 AND (clientes_tb.nombre LIKE '%$buscar%' OR clientes_tb.cif LIKE '%$buscar%') ";
}
if (isset($_GET["inicio"])) {
    $inicio = $_GET["inicio"];
    $porPagina = $_GET["porpagina"];
    $limite = " LIMIT $inicio, $porPagina ";
}

$respuesta = [];

$sqlNumeroRegistros = "SELECT COUNT(*) AS numero_registros FROM clientes_tb WHERE activo = 1";
$respuestaNumerosRegistros = mysqli_query($conn, $sqlNumeroRegistros);

$fila = mysqli_fetch_assoc($respuestaNumerosRegistros);
$respuesta["numero_registros"] = $fila['numero_registros'];

$sqlClientes = "SELECT clientes_tb.*, clientes_sectores_tb.nombre AS sector
                FROM clientes_tb
                LEFT JOIN clientes_sectores_tb ON clientes_tb.id_sector = clientes_sectores_tb.id $condicion ORDER BY clientes_tb.id desc $limite";

$resultadoClientes = mysqli_query($conn, $sqlClientes);

$clientes = [];

while ($cliente = mysqli_fetch_assoc($resultadoClientes)) {
    $sqlContactos = "SELECT * FROM clientes_contactos_tb WHERE id_cliente= " . $cliente["id"];
    $sqlFacturacion = "SELECT SUM(facturas_tb.baseimponible) AS total_facturacion
                        FROM facturas_tb
                        WHERE facturas_tb.id_cliente = " . $cliente["id"];

    $resultadoContactos = mysqli_query($conn, $sqlContactos);
    $contactos = [];

    while ($contacto = mysqli_fetch_assoc($resultadoContactos)) {
        $contactos[] = $contacto;
    }

    $resultadoFacturacion = mysqli_query($conn, $sqlFacturacion);

    if ($resultadoFacturacion) {
        if (mysqli_num_rows($resultadoFacturacion) > 0) {
            $facturacion = mysqli_fetch_row($resultadoFacturacion);
            if ($facturacion[0] == null) {
                $cliente["facturacion"] = 0;
            } else {
                $cliente["facturacion"] = $facturacion[0];
            }
        } else {
            $cliente["facturacion"] = 0;
        }
    } else {
        $cliente["facturacion"] = "Error en la consulta: " . mysqli_error($conn);
    }

    $cliente["contactos"] = $contactos;
    $clientes[] = $cliente;
}

$respuesta["clientes"] = $clientes;
echo json_encode($respuesta);
?>
