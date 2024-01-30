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

            const proveedoresContactosContenedor = proveedorContenedor.querySelector(".proveedor-row-contactos");
            const templateContacto = proveedoresContactosContenedor.querySelector(".contactos-contacto");

            proveedorContenedor.querySelector(".proveedor-datos-nombre").textContent = proveedores.nombre;
            proveedorContenedor.querySelector(".proveedor-datos-cif").textContent = proveedores.cif;
            proveedorContenedor.querySelector(".proveedor-datos-tlf").textContent = proveedores.telefono;
            proveedorContenedor.querySelector(".proveedor-datos-direccion").textContent = proveedores.direccion;

            proveedores.contactos.forEach((contacto) => {
                const contactoContenedor = templateContacto.cloneNode(true);
                contactoContenedor.classList.remove("hidden");

                contactoContenedor.querySelector(".contacto-nombre").textContent = contacto.name + " " + contacto.apell1 + " " + contacto.apell2;
                contactoContenedor.querySelector(".contacto-telefono").textContent = contacto.phone1;
                contactoContenedor.querySelector(".contacto-email").textContent = contacto.mail1;
                proveedoresContactosContenedor.append(contactoContenedor);
            })
            

            contenedorListado.append(proveedorContenedor);
        })
    }

    getProveedores();
}

doProveedores();
