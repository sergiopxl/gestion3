<?php

include("conn/parameters.php");

$conn = mysqli_connect(HOST,USER,PASSWORD) or die("no se puede conectar bro");
mysqli_select_db($conn, DATABASE);
mysqli_set_charset($conn, "UTF8");

if($conn->connect_error){
    die("connection failed: ". $conn->connect_error);
}else{
    //no hace nada
    //echo("TODO GUAY");
}

?>