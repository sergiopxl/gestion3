<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once 'conn/conexion.php';

$sqlUsuarios = "SELECT usuarios_tb.id,
                       usuarios_tb.username AS nombre, 
                       usuarios_tb.email, 
                       usuarios_tb.avatar, 
                       usuarios_permisos_tb.name AS role 
                       FROM usuarios_tb 
                       LEFT JOIN usuarios_permisos_tb 
                       ON usuarios_tb.id_permiso = usuarios_permisos_tb.id 
                       WHERE 1 ORDER BY usuarios_tb.id DESC";

$sqlResponse = mysqli_query($conn,$sqlUsuarios);

$usuarios = [];

while($usuario = mysqli_fetch_assoc($sqlResponse)){
  $usuarios[] = $usuario;
};

echo json_encode($usuarios);