"use strict";
console.log("proveedores.js 1.0");

function doProveedores() {
    let paginaActual = 1; 
    const contenedorListadoProveedores = document.getElementById("proveedores-listado");
    const getProveedores = (actual, buscar) => {
        
        let parametroBuscar = "";
        let busquedaActiva = false;
        let parametroPorPagina = "&porpagina=20";
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

        const parametroInicio = "?inicio=" + inicio;

        const newLoader = new Loader();

        fetch(
            apiUrlProveedoresGet +
            parametroInicio +
            parametroPorPagina +
            parametroBuscar, {
            method: "GET"
        })
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((proveedores) => {
                printListaProveedores(proveedores.proveedores);
                newLoader.destroy();
            })
            .catch((error) => {
                newLoader.destroy();
                const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servicio`;
                new Modal(mensajeError, "informacion", "", "");
            });
    };

    const printListaProveedores = (proveedores) => {
        // Limpiamos el contenedor antes de agregar nuevos elementos
        contenedorListadoProveedores.innerHTML = "";

        // Iteramos sobre la lista de proveedores
        proveedores.forEach((proveedor) => {
            const proveedorContenedor = document.createElement("div");
            proveedorContenedor.textContent = `ID: ${proveedor.id}, Nombre: ${proveedor.nombre}, CIF: ${proveedor.cif}`;
            contenedorListadoProveedores.append(proveedorContenedor);
        });
    };

    // Llama a la función principal para cargar la lista de proveedores al cargar la página
    getProveedores();
}

doProveedores();
