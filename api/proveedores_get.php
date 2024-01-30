<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Incluir la conexión a la base de datos
include("conn/conexion.php");

// Obtener parámetros de la solicitud
$inicio = $_GET["inicio"];
$porPagina = $_GET["porpagina"];
$condicion = "";

// Verificar si se proporcionó un término de búsqueda
if (isset($_GET["buscar"])) {
    $buscar = $_GET["buscar"];
    // Añadir condición de búsqueda a la consulta SQL
    $condicion .= " WHERE (proveedores_tb.nombre LIKE '%$buscar%' OR proveedores_tb.cif LIKE '%$buscar%') ";
}

// Limitar la cantidad de resultados devueltos
$limite = " LIMIT $inicio, $porPagina ";
$respuesta = [];

// Consultar el número total de registros en la tabla de proveedores
$sqlNumeroRegistros = "SELECT COUNT(*) AS numero_registros FROM proveedores_tb";
$respuestaNumerosRegistros = mysqli_query($conn, $sqlNumeroRegistros);

// Obtener el número total de registros y añadirlo a la respuesta
$fila = mysqli_fetch_assoc($respuestaNumerosRegistros);
$respuesta["numero_registros"] = $fila['numero_registros'];

// Consultar los datos de proveedores con la condición de búsqueda
$sqlProveedores = "SELECT * FROM proveedores_tb $condicion ORDER BY id DESC $limite";

$resultadoProveedores = mysqli_query($conn, $sqlProveedores);

$proveedores = [];

// Iterar sobre los resultados de la consulta de proveedores
while ($proveedor = mysqli_fetch_assoc($resultadoProveedores)) {
    // Para cada proveedor, consultar sus contactos asociados
    $sqlContactos = "SELECT * FROM proveedores_contactos_tb WHERE id_proveedor = " . $proveedor["id"];

    $resultadoContactos = mysqli_query($conn, $sqlContactos);
    $contactos = [];

    // Recopilar la información de los contactos asociados al proveedor
    while ($contacto = mysqli_fetch_assoc($resultadoContactos)) {
        $contactos[] = $contacto;
    }

    // Añadir la información de los contactos al array del proveedor
    $proveedor["contactos"] = $contactos;
    // Añadir la información del proveedor al array general de proveedores
    $proveedores[] = $proveedor;
}

// Añadir la información de los proveedores a la respuesta final y devolverla como JSON
$respuesta["proveedores"] = $proveedores;
echo json_encode($respuesta);
?>

