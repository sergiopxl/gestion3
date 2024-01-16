"use strict";
console.log("clientes.js 1.1");
function doClientes() {
  //declaracion de variabless
  let paginaActual = 1;
  const resultadosPorPagina = 20;

  const contenedorListado = document.querySelector("main");
  const templateCliente = document.querySelector(".cliente-row");
  //funcion que recibe pagina actual
  const getClientes = (actual) => {
    let parametroBuscar = "";
    //    let busquedaActiva = false;
    let inicio;

    if (actual) paginaActual = actual;
    if (paginaActual == 1) inicio = 0;
    else {
      inicio = (paginaActual - 1) * resultadosPorPagina;
    }

    let parametroPorPagina = "&porpagina=" + resultadosPorPagina;

    const parametroInicio = "?inicio= " + inicio;

    fetch(apiUrlClientesGet + parametroInicio + parametroPorPagina, {
      method: "GET",
    }).then((respuesta) => {
      respuesta.json().then((clientes) => {
        //console.log(clientes);
        printlistaClientes(clientes.numero_registros, clientes.clientes);
      });
    });
  };
  function printlistaClientes(registros, clientes) {
    contenedorListado.innerHTML ="";
    doPaginacion(paginaActual, resultadosPorPagina, registros, getClientes);


    clientes.forEach((cliente) => {
      const clienteContenedor = templateCliente.cloneNode(true);
      clienteContenedor.classList.remove("hidden");

      const clientesContactosContenedor = clienteContenedor.querySelector(
        ".cliente-row-contactos"
      );
      const templateContacto = clientesContactosContenedor.querySelector(
        ".contactos-contacto"
      );


      clienteContenedor.querySelector(".cliente-datos-nombre").textContent =
        cliente.nombre;
      clienteContenedor.querySelector(".cliente-datos-cif").textContent =
        cliente.cif;
      clienteContenedor.querySelector(".cliente-datos-tlf").textContent =
        cliente.telefono;
      clienteContenedor.querySelector(".cliente-datos-direccion").textContent =
        cliente.direccion;


      cliente.contactos.forEach((contacto, index) => {
        const contactoContenedor = templateContacto.cloneNode(true);
        contactoContenedor.classList.remove("hidden");

                contactoContenedor.querySelector(".contacto-nombre").textContent = contacto.nombre + " " + contacto.nombre + " "+contacto.apellido1+" "+ contacto.apellido2 ;
                contactoContenedor.querySelector(".contacto-telefono").textContent = contacto.telefono1;
                contactoContenedor.querySelector(".contacto-email").textContent = contacto.email;
                clientesContactosContenedor.append(contactoContenedor);
            })
            contenedorListado.append(clienteContenedor);

            
        })
    }
    getClientes();
}

doClientes();
