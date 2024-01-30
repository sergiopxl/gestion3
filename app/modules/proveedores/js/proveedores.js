"use strict";
console.log("proveedores.js 1.0");

function doProveedores() {
    let paginaActual = 1;
    const resultadosPorPagina = 10;
    const contenedorListado = document.querySelector("main");
    const templateProveedor = document.querySelector(".proveedor-row");

    const buscadorInput = document.querySelector("#buscador-input");
    const buscadorBoton = document.querySelector("#buscador-boton");
    buscadorBoton.addEventListener("click", () => {
        if(buscadorInput.value != ""){
            paginaActual = 1;
            getProveedores(paginaActual, buscadorInput.value)
        }
    });

    
    const nuevoProveedorBtn = document.querySelector("#nuevo-proveedor-btn");

    nuevoProveedorBtn.addEventListener("click", (event) =>{
        event.preventDefault();
        doNuevoProveedor();
        console.log("Funciona nuevo proveedor");
    })

    const getProveedores = (actual, buscar) => {
        let parametroBuscar = "";
        let busquedaActiva = false;
        let parametroPorPagina = "&porpagina=" + resultadosPorPagina;
        let inicio;

        if (actual) paginaActual = actual;
        if (paginaActual == 1) inicio = 0;
        else {
            inicio = (paginaActual - 1) * resultadosPorPagina;
        }

        if (buscar && buscar != "") {
            parametroBuscar = "&buscar=" + buscar;
            busquedaActiva = true;
            parametroPorPagina = "&porpagina=" + 99999;
        }


        const parametroInicio = "?inicio= " + inicio;

        fetch(apiUrlProveedoresGet + parametroInicio + parametroPorPagina + parametroBuscar, { method: "GET" })
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status}`);
                }
                return respuesta.json();
            }).then((proveedores) => {
                printListaProveedores(proveedores.numero_registros, proveedores.proveedores, busquedaActiva);
            }).catch((error) => {
                console.log(error);
                const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servivio`;
                new Modal(mensajeError, "informacion", "", "");
            })
    }

    function printListaProveedores(registros, proveedores, busqueda) {
        contenedorListado.innerHTML= "";
        if(!busqueda) {
            doPaginacion(paginaActual, resultadosPorPagina, registros, getProveedores);
        }else{
            const verTodoBoton = document.createElement("button");
            verTodoBoton.classList.add("btn-info");
            verTodoBoton.textContent = "Ver listado Completo"
            verTodoBoton.addEventListener("click", () => {
                getProveedores();
            });
            document.querySelector("#paginacion").innerHTML = "<h2> Resultados busqueda: " + proveedores.length + "</h2>";
            document.querySelector("#paginacion").append(verTodoBoton);
        }
        proveedores.forEach((proveedores) => {
            const proveedorContenedor = templateProveedor.cloneNode(true);
            proveedorContenedor.classList.remove("hidden");

            // Aqui va la declaracion de la parte de proveedores contactos

            proveedorContenedor.querySelector(".proveedor-datos-nombre").textContent = proveedores.nombre;
            proveedorContenedor.querySelector(".proveedor-datos-cif").textContent = proveedores.cif;
            proveedorContenedor.querySelector(".proveedor-datos-tlf").textContent = proveedores.telefono;
            proveedorContenedor.querySelector(".proveedor-datos-direccion").textContent = proveedores.direccion;
            

            contenedorListado.append(proveedorContenedor);
        })
    }

    function newBloqueFormulario() {
        const bloqueFormulario = document.querySelector("#bloque-formulario").cloneNode(true);
    
    
        bloqueFormulario.id = "";
        bloqueFormulario.classList.add("bloque-formulario");
        return bloqueFormulario
      }



    function doNuevoProveedor(){
        const bloqueFormulario = newBloqueFormulario();
        const proveedorFormularioEdicion = bloqueFormulario.querySelector(".proveedor-formulario");

        const proveedorSelectSector = proveedorFormularioEdicion.querySelector("[name = 'select-proveedor-servicio']");
        const botonNuevoProveedorEnviar = proveedorFormularioEdicion.querySelector(".formulario-boton-enviar");


        /*getClientesSectores(clientesSelectSector, "");
        console.log("clientes, " + clientesSelectSector);
        */
    botonNuevoProveedorEnviar.addEventListener("click", (e) => {
      e.preventDefault();
      new Modal("¿Quieres dar de alta este proveedor?", "confirmacion", guardarNuevoProveedor, "");
    })
    contenedorListado.innerHTML = "";
    contenedorListado.append(bloqueFormulario);
    bloqueFormulario.classList.remove("hidden");


    function guardarNuevoProveedor() {
        const datosFormulario = new FormData(proveedorFormularioEdicion);
        fetch(apiUrlProveedoresInsert, { method: "POST", body: datosFormulario })
          .then((respuesta) => {
            if (!respuesta.ok) {
              throw new Error(`Error en la solicitud: ${respuesta.status}`);
            }
            new Modal("Proveedor dado de alta correctamente", "informacion", doProveedores, "");
            return respuesta.json();

          }
          )
      }
    }




    getProveedores();
}

doProveedores();
