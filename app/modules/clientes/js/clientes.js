"use strict";
console.log("clientes.js 1.1");

function doClientes() {
    //declaracion de variabless
    let paginaActual = 1;
    const resultadosPorPagina = 200;

    const contenedorListado = document.querySelector("main");
    const templateCliente = document.querySelector(".cliente-row");

    const buscadorInput = document.querySelector("#buscador-input");
    const buscadorBoton = document.querySelector("#buscador-boton");
    buscadorBoton.addEventListener("click", () => {
        if (buscadorInput.value != "") {
            paginaActual = 1;
            getClientes(paginaActual, buscadorInput.value);
        }
    });

    //funcion que recibe pagina actual
    const getClientes = (actual, buscar) => {
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

        const newLoader = new Loader();

        fetch(
                apiUrlClientesGet +
                parametroInicio +
                parametroPorPagina +
                parametroBuscar, {
                    method: "GET"
                }
            )
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((clientes) => {
                printlistaClientes(
                    clientes.numero_registros,
                    clientes.clientes,
                    buscar
                );
                newLoader.destroy();
            })
            .catch((error) => {
                newLoader.destroy();
                const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servicio`;
                new Modal(mensajeError, "informacion", "", "");
            });
    };

    function printlistaClientes(registros, clientes, busqueda) {
        contenedorListado.innerHTML = "";
        if (!busqueda) {
            doPaginacion(paginaActual, resultadosPorPagina, registros, getClientes);
        } else {
            const verTodoBoton = document.createElement("button");
            verTodoBoton.classList.add("btn-info");
            verTodoBoton.textContent = "Ver listado completo";
            verTodoBoton.addEventListener("click", () => {
                getClientes();
            });
            document.querySelector("#paginacion").innerHTML =
                "<h2> Resultados busqueda:" + clientes.length + "</h2>";
            document.querySelector("#paginacion").append(verTodoBoton);
        }

        clientes.forEach((cliente) => {
            const clienteContenedor = templateCliente.cloneNode(true);
            clienteContenedor.classList.remove("hidden");

            const clientesContactosContenedor = clienteContenedor.querySelector(
                ".cliente-row-contactos"
            );
            const templateContacto = clientesContactosContenedor.querySelector(
                ".contactos-contacto"
            );

            const clienteBotonEditar = clienteContenedor.querySelector(
                ".cliente-botones-editar"
            );
            //const clienteBotonFactura = clienteContenedor.querySelector(".cliente-botones-factura");
            clienteBotonEditar.addEventListener("click", () => {
                doEditar(cliente);
            });

            clienteContenedor.querySelector(".cliente-datos-nombre").textContent =
                cliente.nombre;
            clienteContenedor.querySelector(".cliente-datos-cif").textContent =
                cliente.cif;
            clienteContenedor.querySelector(".cliente-datos-tlf").textContent =
                cliente.telefono;
            clienteContenedor.querySelector(".cliente-datos-direccion").textContent =
                cliente.direccion;
            clienteContenedor.querySelector(".cliente-datos-sector").textContent =
                "Sector: " + cliente.sector;

            cliente.contactos.forEach((contacto, index) => {
                const contactoContenedor = templateContacto.cloneNode(true);
                contactoContenedor.classList.remove("hidden");

                contactoContenedor.querySelector(".contacto-nombre").textContent =
                    contacto.nombre + " " + contacto.apellido1 + " " + contacto.apellido2;
                contactoContenedor.querySelector(".contacto-telefono").textContent =
                    contacto.telefono1;
                contactoContenedor.querySelector(".contacto-email").textContent =
                    contacto.email;
                clientesContactosContenedor.append(contactoContenedor);
            });
            contenedorListado.append(clienteContenedor);
        });
    }

    function doEditar(cliente) {
        const bloqueFormulario = document
            .querySelector("#bloque-formulario")
            .cloneNode(true);
        const clienteFormularioEdicion = bloqueFormulario.querySelector(
            ".cliente-formulario"
        );
        const clientesSelectSector = clienteFormularioEdicion.querySelector(
            "[name = 'select-cliente-sector']"
        );
        const botonEnviar = clienteFormularioEdicion.querySelector(
            ".formulario-boton-enviar"
        );
        //datos
        clienteFormularioEdicion.querySelector(
            "[name = 'input-cliente-id']"
        ).value = cliente.id;
        clienteFormularioEdicion.querySelector(
            "[name = 'input-cliente-nombre']"
        ).value = cliente.nombre;
        clienteFormularioEdicion.querySelector(
            "[name = 'input-cliente-cif']"
        ).value = cliente.cif;
        clienteFormularioEdicion.querySelector(
            "[name = 'input-cliente-tlf']"
        ).value = cliente.telefono;
        clienteFormularioEdicion.querySelector(
            "[name = 'input-cliente-direccion']"
        ).value = cliente.direccion;

        getClientesSectores();
        //setContactos();

        botonEnviar.addEventListener("click", (event) => {
            // previene que el evento no tenga ninguna funcionalidad por defecto
            guardarUpdateCliente();
            event.preventDefault();
           
        });


        function guardarUpdateCliente(){
            const datosFormulario = new FormData(clienteFormularioEdicion);
            fetch(apiUrlClientesUpdate, {
                method: "POST",
                body: datosFormulario,
            }).then((response) =>
                response.json().then((data) => {
                    console.log(data);
                })
            );
        }
        function getClientesSectores() {
            fetch(apiUrlClientesSectoresGet, {
                method: "GET"
            }).then((respuesta) =>
                respuesta.json().then((sectores) => {
                    sectores.forEach((sector) => {
                        const opcionSector = document.createElement("option");
                        opcionSector.value = sector.id;
                        opcionSector.textContent = sector.nombre;
                        if (sector.id == cliente.id_sector) {
                            opcionSector.setAttribute("selected", "selected");
                        }
                        clientesSelectSector.append(opcionSector);
                    });
                })
            );
        }

        contenedorListado.innerHTML = "";
        contenedorListado.append(bloqueFormulario);
        bloqueFormulario.classList.remove("hidden");
    }
    getClientes();
}

doClientes();