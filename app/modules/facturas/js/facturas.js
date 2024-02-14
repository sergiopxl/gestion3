"use strict"
console.log("facturas.js 1.1");

function doFacturas() {

  const contenedorListado = document.querySelector("main");
  const templateFactura = document.querySelector("#factura-template");
  const botonNuevaFactura = document.querySelector("#nueva-factura-btn");
  const templateNuevaFactura = document.querySelector("#factura-new-template");
  const contenedorAcciones = document.querySelector(".acciones-paginacion");
  let importeIva = document.querySelector("[name = 'input-iva']");
  botonNuevaFactura.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("klk miloco");
    nuevaFactura();
  });
  /*
    - selección de elementos html
    - declaración de variables de ambito general 
    - eventos de acciones generales del apartado
  */

  getFacturas();

  function getFacturas() {

    fetch(apiUrlFacturasGet + "?listado=1", { method: "GET" })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error en la solicitud: ${respuesta.status}`)
        }
        respuesta.json().then((facturas) => {
          printFacturas(facturas);
        });
      })

    /*
      llamada al API que retorna las facturas
    */

    //printFacturas(facturas) // esto se ejecuta cuando se resuelve la llamada al API
  }

  function printFacturas(facturas) {
    console.log(facturas);
    contenedorListado.innerHTML = "";

    facturas.forEach((factura) => {


      const facturasContenedor = templateFactura.cloneNode(true);
      facturasContenedor.id = "";
      facturasContenedor.classList.remove("hidden");
      const contenedorItems = facturasContenedor.querySelector(".factura-items");

      const numeroFactura = facturasContenedor.querySelector(".factura-numero strong").textContent = factura.id;
      const clienteFactura = facturasContenedor.querySelector(".factura-cliente strong").textContent = factura.cliente;
      const estadoFactura = facturasContenedor.querySelector(".factura-estado strong").textContent = factura.estado;
      const importeFactura = facturasContenedor.querySelector(".factura-importe strong").textContent = formatoMoneda(factura.baseimponible * (1 + factura.iva / 100));
      const descripcionFactura = facturasContenedor.querySelector(".factura-descripcion").textContent = factura.descricion;

      factura.items.forEach((item) => {
        const templateItems = facturasContenedor.querySelector("#factura-item-template");
        const rowItems = templateItems.cloneNode(true);
        rowItems.id = "";
        rowItems.classList.remove("hidden");

        rowItems.querySelector(".item-descripcion").textContent = item.descripcion;
        rowItems.querySelector(".item-importe").textContent = formatoMoneda(parseFloat(item.importe + 0));

        contenedorItems.append(rowItems);
      })

      contenedorListado.append(facturasContenedor);
    }

    )

    /*
      - limpiar main
      + bucle sobre el array de facturas
        - clonado del template de factura que se encuentra en el html , eliminar id, quita clase oculto, añadir clase
        - carga de datos de factura
        - evento de boton editar -> editarFactura(factura)
        + bucle sobre items de facturas
          - clonado de template item , eliminar id, quita clase oculto, añadir clase
          - carga datos item
          - appen item al contenedor de items
        - append factura al main
    */
  }
  function nuevaFactura() {

    //const contenedorNuevaFactura = templateNuevaFactura.cloneNode(true);
    contenedorListado.innerHTML = "";
    templateNuevaFactura.classList.remove("hidden");
    contenedorListado.append(templateNuevaFactura);

    let fechaHoy = new Date();
    const dia = fechaHoy.getDate().toString().padStart(2, "0");
    const mes = (fechaHoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaHoy.getFullYear();
    console.log(anio);

    fechaHoy = anio + "-" + mes + "-" + dia;
    templateNuevaFactura.querySelector("[name='input-fecha-emision']").value = fechaHoy;
    console.log(fechaHoy);


    

    contenedorAcciones.innerHTML = "";
    const botonGuardar = document.createElement("button");
    botonGuardar.classList.add("btn-success");
    const botonNuevoConcepto = document.createElement("button");
    botonNuevoConcepto.classList.add("btn-success");
    botonGuardar.textContent = "Guardar";
    botonNuevoConcepto.textContent = "Nuevo Concepto";

    const botonBuscarCliente = document.querySelector("#buscar-cliente-btn");
    botonBuscarCliente.addEventListener("click", (e)=>{
        e.preventDefault();
        console.log("llegamos al buscador mi loco");
        buscarCliente();
        console.log("salimos del buscador mi loco");

    });
    botonGuardar.addEventListener("click", (e) => {
      e.preventDefault();
      guardarNuevaFactura();
    });

    botonNuevoConcepto.addEventListener("click", (e) => {
      e.preventDefault();
      crearItem();
    });

    importeIva.addEventListener("change", () =>{
      calcularImporteTotal();
    })
    contenedorAcciones.append(botonNuevoConcepto, botonGuardar);


    /*
      - limpiar main
      - clonado de formulario factura ,quita clase oculto, añadir clase
      - evento botón nuevoConcepto -> crearItem(contenedorItems)
      - evento boton buscar cliente -> buscarCliente()
      - evento botón guardar -> guardarNuevaFactura()
    */

    function guardarNuevaFactura() {
      /*
        - recogida de datos del formulario creando un JSON, no se puede hacer con un FormData.
        - envio de datos al API POST, los datos del body han de ir en formato JSON pero convertidos a cadena.
        - información resultado del alta
      */
    }

  }

  function editarFactura(factura) {
    /*
      - limpiar main
      - clonado de formulario factura, eliminar id, añadir clase
      - evento botón nuevoConcepto -> crearItem(contenedorItems)
      - evento boton buscar cliente -> buscarCliente() 
      - evento botón guardar -> guardarEdicionFactura()
      - cargar datos de factura en el formulario
      + bucle sobre factura.items
        - crearItem(contenedorItems,datoItem)
    */
    function guardarEdicionFactura() {
      /*
       - recogida de datos del formulario creando un JSON, no se puede hacer con un FormData.
       - envio de datos al API POST, los datos del body han de ir en formato JSON pero convertidos a cadena.
       - información resultado del alta
     */
    }
  }

  function crearItem(contenedorItems, datoItem) {
    const listadoConceptos = templateNuevaFactura.querySelector(".listado-conceptos");
    const templateItem = document.querySelector("#concepto-template");
    const contenedorItem = templateItem.cloneNode(true);
    contenedorItem.classList.remove("hidden");


    contenedorItem.id = "";
    contenedorItem.classList.add("concepto-template");
    const importe = contenedorItem.querySelector("[name= 'input-importe']");
    listadoConceptos.append(contenedorItem);
    const botonEliminarItem = contenedorItem.querySelector(".eliminar-concepto");

    botonEliminarItem.addEventListener("click", (e) => {
      e.preventDefault();
      eliminarItem(contenedorItem);
    })

    importe.addEventListener("change", () => {
      calcularImporteTotal();
    })


  }
  function calcularImporteTotal() {
    const contenedorImporte = document.querySelector(".importe-total");
    
    const listaImportes = document.querySelectorAll("[name= 'input-importe']");
    let sumatorio = 0;
    //console.log(listaImportes);
    listaImportes.forEach(elemento => {
      //console.log(elemento.value);
      sumatorio += parseFloat(elemento.value);
    });

    sumatorio = sumatorio *(1+(importeIva.value/100));

    contenedorImporte.textContent = formatoMoneda(sumatorio);
  }
  function eliminarItem(item) {
    item.remove();
    calcularImporteTotal();

  }
  function buscarCliente() {
    const contendorNombreCliente = document.querySelector(".cliente-vista span");
    const inputIdCCliente = document.querySelector("[name='input-id-cliente']");
    const selectContactos = document.querySelector("[name= 'contacto-select']");
    const busqueda = new Buscador(contendorNombreCliente, inputIdCCliente, selectContactos);
    
  }
    
   
    
  
  
}
doFacturas();