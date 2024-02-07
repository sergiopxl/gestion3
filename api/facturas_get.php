<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET");

include("conn/conexion.php");

$respuesta = [];
$error = false;


if(isset($_GET["listado"])){
    $facturas = [];
    $sqlFacturas = "SELECT facturas_tb.*, clientes_tb.nombre AS cliente, facturas_estados_tb.nombre AS estado
    FROM facturas_tb LEFT JOIN clientes_tb ON facturas_tb.id_cliente = clientes_tb.id 
    LEFT JOIN facturas_estados_tb ON facturas_tb.id_estado = facturas_estados_tb.id
    WHERE 1;";
    $respuestaFacturas = mysqli_query($conn, $sqlFacturas);
    while($factura = mysqli_fetch_assoc($respuestaFacturas)){
        $idFactura = $factura["id"];
    
        $sqlItems = "SELECT * FROM facturas_items_tb
                        WHERE id_factura = $idFactura";
        $respuestaItems = mysqli_query($conn,$sqlItems);

        $items = [];
        while($item = mysqli_fetch_assoc($respuestaItems)){
            $items[] = $item;
        }
        $factura["items"] = $items;
        $facturas[] = $factura;
    }
    $respuesta = $facturas;
}

if(!$error)
    echo json_encode($respuesta);
else
    echo json_encode("Ha habido problemas");