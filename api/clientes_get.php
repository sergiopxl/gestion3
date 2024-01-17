<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");


include ("conn/conexion.php");
$inicio = $_GET["inicio"];
$porPagina = $_GET["porpagina"];
$condicion = " WHERE activo = 1 ";

if(isset($_GET["buscar"])){
    $buscar = $_GET["buscar"];
    $condicion = " WHERE activo = 1 AND (cliente_tb.nombre LIKE '%$buscar%' OR clientes_tb.cif '$buscar') ";
}

$limite = " LIMIT $inicio, $porPagina ";
$respuesta = [];

$sqlNumeroRegistros = "SELECT COUNT(*) AS numero_registros FROM clientes_tb WHERE activo = 1";
$respuestaNumerosRegistros = mysqli_query($conn,$sqlNumeroRegistros);


    $fila = mysqli_fetch_assoc($respuestaNumerosRegistros);
    $respuesta["numero_registros"] = $fila['numero_registros'];

$sqlClientes = "SELECT clientes_tb.*, clientes_sectores_tb.nombre AS sector
FROM clientes_tb
LEFT JOIN clientes_sectores_tb ON clientes_tb.id_sector = clientes_sectores_tb.id $condicion $limite";
$resultadoClientes = mysqli_query($conn,$sqlClientes);
//var_dump($resultadoClientes);
$clientes = [];
while($cliente= mysqli_fetch_assoc($resultadoClientes)){
    $sqlContactos = "SELECT * From clientes_contactos_tb WHERE id_cliente= " . $cliente["id"];

    $resultadoContactos = mysqli_query($conn, $sqlContactos);
    $contactos = [];
    while($contacto = mysqli_fetch_assoc($resultadoContactos)){
        $contactos[] = $contacto;
    }    
    $cliente["contactos"] = $contactos;
    $clientes[] = $cliente; 
}
$respuesta["clientes"] = $clientes;
echo json_encode($respuesta);
?>