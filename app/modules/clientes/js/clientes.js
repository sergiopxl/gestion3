"use strict"
console.log("clientes.js 1.1");
function doClientes(){
    const contenedorListado = document.querySelector("main");
    const templateCliente = document.querySelector(".cliente-row");
    function getClientes(){
        fetch(apiUrlClientesGet, {method: "GET"}).then((respuesta)=>{
            respuesta.json().then((clientes)=>{
                //console.log(clientes);
                printlistaClientes(clientes);
            })
        })
    }
    function printlistaClientes(clientes){
        clientes.forEach(cliente => {
            const clienteContenedor = templateCliente.cloneNode(true);
            clienteContenedor.querySelector(".cliente-datos-nombre").textContent = cliente.nombre;
            contenedorListado.append(clienteContenedor);
        })
    }
    getClientes();
}

doClientes();