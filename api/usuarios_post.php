<?php

// Establece el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Establece los encabezados para permitir solicitudes CORS desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, X-User-ID,X-Token, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: POST");

// Incluye el archivo de conexión a la base de datos
require_once 'conn/conexion.php';

// Variable para almacenar la ruta del archivo en el servidor
$rutaParaBaseDatos = "";

// Verifica si se ha enviado un archivo
if ($_FILES['avatar']) {
    // Obtiene información sobre el archivo enviado
    $nombreArchivoOriginal = $_FILES['archivo']['name'];
    $tipoArchivo = $_FILES['archivo']['type'];
    $tamañoArchivo = $_FILES['archivo']['size'];
    $rutaTemporal = $_FILES['archivo']['tmp_name'];

    // Directorio de destino para almacenar el archivo
    $directorioDestino = '../app/assets/avatares/';

    // Genera un nombre único para el archivo
    $nombreArchivoUnico = uniqid() . '_' . $nombreArchivoOriginal;

    // Ruta completa del archivo en el servidor
    $rutaCompletaArchivo = $directorioDestino . $nombreArchivoUnico;
    
    // Ruta para almacenar en la base de datos
    $rutaParaBaseDatos = "../../assets/avatares/". $nombreArchivoUnico;

    // Mueve el archivo a su ubicación final en el servidor
    move_uploaded_file($rutaTemporal, $rutaCompletaArchivo);
}

// Obtiene los datos del formulario enviado por POST
$nombre = $_POST["nombre-usuario"];
$email = $_POST["email-usuario"];
$pass = md5($_POST["password-usuario"]); // Usa la función md5() para realizar un hash de la contraseña

// Construye la consulta SQL para insertar un nuevo usuario en la base de datos
$sqlInserUsuarios = "INSERT INTO `usuarios_tb`( `avatar`, `username`, `email`, `password`, `id_permiso`) VALUES ('$rutaParaBaseDatos','$nombre','$email','$pass', 1)";

// Ejecuta la consulta SQL
$sqlRespuesta = mysqli_query($conn,$sqlInserUsuarios);

// Verifica si la consulta se ejecutó correctamente
if($sqlRespuesta){
  // Si la consulta se ejecutó correctamente, devuelve un mensaje de "Alta de usuario correcta"
  echo json_encode("Alta de usuario correcta");
}else{
  // Si la consulta no se ejecutó correctamente, devuelve un mensaje de error
  echo json_encode("No se ha guardado el usuario");
}

?>
