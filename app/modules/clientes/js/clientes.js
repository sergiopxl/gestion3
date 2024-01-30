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

  const nuevoClienteBtn = document.querySelector("#nuevo-cliente-btn");

  nuevoClienteBtn.addEventListener("click", (event) => {
    event.preventDefault();
    doNuevoCliente();
    console.log("Funciona")
  })



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
      clienteContenedor.querySelector(".cliente-datos-factura").textContent =
        formatoMoneda(cliente.facturacion);

      cliente.contactos.forEach((contacto) => {
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


    const bloqueFormulario = newBloqueFormulario();
    const clienteFormularioEdicion = bloqueFormulario.querySelector(".cliente-formulario");
    const clientesSelectSector = clienteFormularioEdicion.querySelector("[name = 'select-cliente-sector']");
    const botonEnviar = clienteFormularioEdicion.querySelector(".formulario-boton-enviar");
    //datos
    const contactosContenedor = bloqueFormulario.querySelector(".cliente-contactos-contenedor-formulario");
    const contactoNuevoBtn = contactosContenedor.querySelector(".nuevo-contacto-boton");
    const contactoFormulario = contactosContenedor.querySelector("form");



    clienteFormularioEdicion.querySelector("[name = 'input-cliente-id']").value = cliente.id;
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

    getClientesSectores(clientesSelectSector, cliente.id_sector);
    setContactos();

    botonEnviar.addEventListener("click", (event) => {
      // previene que el evento no tenga ninguna funcionalidad por defecto

      event.preventDefault();
      new Modal("¿Seguro que quieres guardar los cambios?", "confirmacion", guardarUpdateCliente, "");

    });

    contactoNuevoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const formularioNuevoContacto = contactoFormulario.cloneNode(true);
      formularioNuevoContacto.classList.remove("hidden");
      const botonEnviarContactoNuevo = formularioNuevoContacto.querySelector("button.enviar");
      contactoNuevoBtn.after(formularioNuevoContacto, contactosContenedor.querySelector("form"));
      formularioNuevoContacto.querySelector("button.eliminar").remove();
      formularioNuevoContacto.querySelector("[name='input-contacto-cliente-id']").value = cliente.id;
      botonEnviarContactoNuevo.addEventListener("click", (e) => {
        e.preventDefault();
        new Modal("Quieres guardar este contacto?", "confirmacion", guardarNuevoContacto, formularioNuevoContacto);
      });
    })


    function guardarUpdateCliente() {
      const datosFormulario = new FormData(clienteFormularioEdicion);
      fetch(apiUrlClientesUpdate, {
        method: "POST",
        body: datosFormulario,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`No se ha podido leer la tabla de contactos: <br> ${response.status}`);
        }
        return response.json();
      })
        .then((data) => {
          new Modal(data, "informacion", "", "");
        })
        .catch((error) => {
          const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servicio tecnico `;
          new Modal(mensajeError, "informacion", "", "");
        });
    };

    function guardarNuevoContacto(formularioNuevoContacto) {
      const datosFormulario = new FormData(formularioNuevoContacto);
      
      fetch(apiUrlClientesContactosPost, { method: "POST", body: datosFormulario })
        .then((response) => {
          console.log("datosFormulario",datosFormulario);
          console.log(response);
          if (!response.ok) {
            throw new Error(`No se ha podido leer la tabla de contactos: <br> ${respuesta.status}`);
          }
          return response.json();
        })
        .then((data) => {
          new Modal(data, "Informacion", "", "");
        })
        .catch((error) => {
          const mensajeError = `Error en la solicitud: <br> ${error} <br> Consulte con el servicio técnico`;
          new Modal(mensajeError, "informacion", "", "");
        });
    }

    contenedorListado.innerHTML = "";
    contenedorListado.append(bloqueFormulario);
    bloqueFormulario.classList.remove("hidden");

    function setContactos() {
      cliente.contactos.forEach(contacto => {
        const nuevoFormularioContacto = contactoFormulario.cloneNode(true);
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-id']").value = contacto.id;
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-nombre']").value = contacto.nombre;
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-apellido1']").value = contacto.apellido1;
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-apellido2']").value = contacto.apellido2;
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-telefono']").value = contacto.telefono1;
        nuevoFormularioContacto.querySelector("[name = 'input-contacto-email']").value = contacto.email1;
        const botonEnviar = nuevoFormularioContacto.querySelector("button.enviar");
        const botonEliminar = nuevoFormularioContacto.querySelector("button.eliminar");
        botonEnviar.addEventListener("click", (event) => {
          event.preventDefault();
          console.log("enviando cambios de contacto", contacto.id);

        });
        botonEliminar.addEventListener("click", (event) => {
          event.preventDefault();
          console.log("eliminando contacto", contacto.id);
        });
        nuevoFormularioContacto.classList.remove("hidden");
        contactosContenedor.append(nuevoFormularioContacto);
      })

    }
  }

  function newBloqueFormulario() {
    const bloqueFormulario = document.querySelector("#bloque-formulario").cloneNode(true);


    bloqueFormulario.id = "";
    bloqueFormulario.classList.add("bloque-formulario");
    return bloqueFormulario
  }

  function doNuevoCliente() {
    const bloqueFormulario = newBloqueFormulario();
    const clienteFormularioEdicion = bloqueFormulario.querySelector(".cliente-formulario")
    console.log("clienteFormularioEdicion", clienteFormularioEdicion);
    bloqueFormulario.querySelector(".cliente-contactos-contenedor-formulario").remove();

    const clientesSelectSector = clienteFormularioEdicion.querySelector("[name = 'select-cliente-sector']");
    const botonNuevoClienteEnviar = clienteFormularioEdicion.querySelector(".formulario-boton-enviar");
    //llamaa a carga de sectores clientes
    getClientesSectores(clientesSelectSector, "");
    console.log("clientes, " + clientesSelectSector);

    botonNuevoClienteEnviar.addEventListener("click", (e) => {
      e.preventDefault();
      new Modal("¿Quieres dar de alta este cliente?", "confirmacion", guardarNuevoCliente, "");
    })

    contenedorListado.innerHTML = "";
    contenedorListado.append(bloqueFormulario);
    bloqueFormulario.classList.remove("hidden");

    function guardarNuevoCliente() {
      const datosFormulario = new FormData(clienteFormularioEdicion);
      fetch(apiUrlClientesInsert, { method: "POST", body: datosFormulario })
        .then((respuesta) => {
          if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status}`);
          }
          new Modal("Cliente dado de alta correctamente", "informacion", doClientes, "");
          return respuesta.json();

        }
        )
    }

  }
  function getClientesSectores(clientesSelectSector, clienteIdSector) {

    fetch(apiUrlClientesSectoresGet, {
      method: "GET"
    }).then((respuesta) =>
      respuesta.json().then((sectores) => {
        sectores.forEach((sector) => {
          const opcionSector = document.createElement("option");
          opcionSector.value = sector.id;
          opcionSector.textContent = sector.nombre;
          if (clienteIdSector != undefined && sector.id == clienteIdSector) {
            opcionSector.setAttribute("selected", "selected");
          }
          clientesSelectSector.append(opcionSector);
        });
      })
    );
  }



  getClientes();
}

doClientes();