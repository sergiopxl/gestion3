"use strict";
console.log("proveedores.js 1.0");

// Función principal que maneja la funcionalidad relacionada con proveedores
function doProveedores() {
    // Variables para la paginación
    let paginaActual = 1; // Página actual
    const resultadosPorPagina = 10; // Resultados por página

    // Elementos del DOM
    const contenedorListado = document.querySelector("main"); // Contenedor principal
    const templateProveedor = document.querySelector(".proveedor-row"); // Plantilla para una fila de proveedor

    // Elementos de búsqueda
    const buscadorInput = document.querySelector("#buscador-input");
    const buscadorBoton = document.querySelector("#buscador-boton");

    // Evento para el botón de búsqueda
    buscadorBoton.addEventListener("click", () => {
        if (buscadorInput.value !== "") {
            // Si la entrada de búsqueda no está vacía, reiniciar página y obtener proveedores
            paginaActual = 1;
            getProveedores(paginaActual, buscadorInput.value);
        }
    });



    // Botón para agregar un nuevo proveedor
    const nuevoProveedorBtn = document.querySelector("#nuevo-proveedor-btn");

    // Evento para el botón de nuevo proveedor
    nuevoProveedorBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // Llamar a la función para manejar la adición de un nuevo proveedor
        doNuevoProveedor();
        console.log("Funciona nuevo proveedor");
    });

    // Función para obtener proveedores del servidor
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

        if (buscar && buscar !== "") {
            parametroBuscar = "&buscar=" + buscar;
            busquedaActiva = true;
            parametroPorPagina = "&porpagina=" + 99999;
        }

        const parametroInicio = "?inicio=" + inicio;

        // Realizar la solicitud al servidor usando la API de proveedores
        fetch(apiUrlProveedoresGet + parametroInicio + parametroPorPagina + parametroBuscar, { method: "GET" })
            .then((respuesta) => {
                // Manejar la respuesta
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((proveedores) => {
                // Mostrar la lista de proveedores
                printListaProveedores(proveedores.numero_registros, proveedores.proveedores, busquedaActiva);
            })
            .catch((error) => {
                // Manejar errores
                console.log(error);
                const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servicio`;
                new Modal(mensajeError, "informacion", "", "");
            });
    };

    function doEditar(proveedor) {
        const bloqueFormulario = newBloqueFormulario();
        contenedorListado.innerHTML = "";
        contenedorListado.append(bloqueFormulario);
        bloqueFormulario.classList.remove("hidden");
        //datos
        const proveedorFormularioEdicion = bloqueFormulario.querySelector(".proveedor-formulario");

        const proveedoresSelectServicio = proveedorFormularioEdicion.querySelector("[name = 'select-proveedor-servicio'");
        const botonEnviar = proveedorFormularioEdicion.querySelector(".formulario-boton-enviar");

        proveedorFormularioEdicion.querySelector("[name = 'input-proveedor-id'").value = proveedor.id;
        proveedorFormularioEdicion.querySelector("[name = 'input-proveedor-nombre']").value = proveedor.nombre;
        proveedorFormularioEdicion.querySelector("[name = 'input-proveedor-cif']").value = proveedor.cif;
        proveedorFormularioEdicion.querySelector("[name = 'input-proveedor-tlf']").value = proveedor.telefono;
        proveedorFormularioEdicion.querySelector("[name = 'input-proveedor-direccion']").value = proveedor.direccion;

        getProveedoresServicios(proveedoresSelectServicio, proveedor.id_servicio);

        botonEnviar.addEventListener("click", (e) => {
            e.preventDefault();
            new Modal("¿Seguro que quieres guardar cambios?", "confirmacion", guardarNuevoProveedor, proveedorFormularioEdicion)
        })
    }

    // Función para mostrar la lista de proveedores
    function printListaProveedores(registros, proveedores, busqueda) {
        contenedorListado.innerHTML = "";
        if (!busqueda) {
            doPaginacion(paginaActual, resultadosPorPagina, registros, getProveedores);
        } else {
            const verTodoBoton = document.createElement("button");
            verTodoBoton.classList.add("btn-info");
            verTodoBoton.textContent = "Ver listado Completo";
            verTodoBoton.addEventListener("click", () => {
                getProveedores();
            });
            document.querySelector("#paginacion").innerHTML = "<h2> Resultados busqueda: " + proveedores.length + "</h2>";
            document.querySelector("#paginacion").append(verTodoBoton);
        }
        proveedores.forEach((proveedor) => {
            const proveedorContenedor = templateProveedor.cloneNode(true);
            proveedorContenedor.classList.remove("hidden");

            const btnEditar = proveedorContenedor.querySelector(".proveedor-botones-editar");
            btnEditar.addEventListener("click", (e) => {
                e.preventDefault();
                doEditar(proveedor);

            })

            const proveedoresContactosContenedor = proveedorContenedor.querySelector(".proveedor-row-contactos");
            const templateContacto = proveedoresContactosContenedor.querySelector(".contactos-contacto");

            proveedorContenedor.querySelector(".proveedor-datos-nombre").textContent = proveedor.nombre;
            proveedorContenedor.querySelector(".proveedor-datos-cif").textContent = proveedor.cif;
            proveedorContenedor.querySelector(".proveedor-datos-tlf").textContent = proveedor.telefono;
            proveedorContenedor.querySelector(".proveedor-datos-direccion").textContent = proveedor.direccion;
            proveedorContenedor.querySelector(".proveedor-datos-servicio").textContent = proveedor.servicio;

            proveedor.contactos.forEach((contacto) => {
                const contactoContenedor = templateContacto.cloneNode(true);
                contactoContenedor.classList.remove("hidden");

                contactoContenedor.querySelector(".contacto-nombre").textContent = contacto.name + " " + contacto.apell1 + " " + contacto.apell2;
                contactoContenedor.querySelector(".contacto-telefono").textContent = contacto.phone1;
                contactoContenedor.querySelector(".contacto-email").textContent = contacto.mail1;
                proveedoresContactosContenedor.append(contactoContenedor);
            });

            contenedorListado.append(proveedorContenedor);
        });
    }

    // Función para crear un nuevo bloque de formulario
    function newBloqueFormulario() {
        const bloqueFormulario = document.querySelector("#bloque-formulario").cloneNode(true);

        bloqueFormulario.id = "";
        bloqueFormulario.classList.add("bloque-formulario");
        return bloqueFormulario;
    }

    // Función para manejar la adición de un nuevo proveedor
    function doNuevoProveedor() {
        const bloqueFormulario = newBloqueFormulario();
        const proveedorFormularioEdicion = bloqueFormulario.querySelector(".proveedor-formulario");

        const proveedorSelectServicio = proveedorFormularioEdicion.querySelector("[name = 'select-proveedor-servicio']");
        const botonNuevoProveedorEnviar = proveedorFormularioEdicion.querySelector(".formulario-boton-enviar");

        getProveedoresServicios(proveedorSelectServicio, "");
        // Evento para el botón de enviar en el formulario de nuevo proveedor
        botonNuevoProveedorEnviar.addEventListener("click", (e) => {
            e.preventDefault();
            // Pedir confirmación antes de agregar el nuevo proveedor
            new Modal("¿Quieres dar de alta este proveedor?", "confirmacion", guardarNuevoProveedor, "");
        });

        contenedorListado.innerHTML = "";
        contenedorListado.append(bloqueFormulario);
        bloqueFormulario.classList.remove("hidden");


    }

    // Función para guardar el nuevo proveedor
    function guardarNuevoProveedor(proveedorFormularioEdicion) {
        const datosFormulario = new FormData(proveedorFormularioEdicion);
        // Fetch para insertar el nuevo proveedor
        fetch(apiUrlProveedoresInsert, { method: "POST", body: datosFormulario })
            .then((respuesta) => {
                // Manejar la respuesta
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status}`);
                }
                // Mostrar mensaje de éxito y actualizar la lista de proveedores
                new Modal("Proveedor modificado correctamente", "informacion", doProveedores, "");
                return respuesta.json();
            });
    }

    function getProveedoresServicios(proveedoresSelectServicio, proveedorIdServicio) {

        fetch(apiUrlProveedoresServiciosGet, {
            method: "GET"
        }).then((respuesta) =>
            respuesta.json().then((servicios) => {
                servicios.forEach((servicio) => {
                    const opcionServicio = document.createElement("option");
                    opcionServicio.value = servicio.id;
                    opcionServicio.textContent = servicio.name;
                    if (proveedorIdServicio != undefined && servicio.id == proveedorIdServicio) {
                        opcionServicio.setAttribute("selected", "selected");
                    }
                    proveedoresSelectServicio.append(opcionServicio);
                });
            })
        );
    }

    // Obtener proveedores al cargar la página
    getProveedores();
}

// Llamar a la función principal para inicializar la funcionalidad de proveedores
doProveedores();
