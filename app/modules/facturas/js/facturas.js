"use strict"
console.log("facturas.js 1.1");

function doFacturas() {

  const contenedorListado = document.querySelector("main");
  const templateFactura = document.querySelector("#factura-template");
  const botonNuevaFactura = document.querySelector("#nueva-factura-btn");
  const templateNuevaFactura = document.querySelector("#factura-new-template");
  const contenedorAcciones = document.querySelector(".acciones-paginacion");
  let importeIva = ""; 
  
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
      facturasContenedor.querySelector(".factura-fecha-emision").textContent ="Emision: " + factura.fecha_emision;
      const botonEditarFactura = facturasContenedor.querySelector(".factura-editar-button");
      

      botonEditarFactura.addEventListener("click", (e) => {
        e.preventDefault
        console.log("factura click",factura);
        editarFactura(factura);
      })

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

    const contenedorNuevaFactura = templateNuevaFactura.cloneNode(true);
    importeIva = contenedorNuevaFactura.querySelector("[name = 'input-iva']");
    const idItem = 
    contenedorListado.innerHTML = "";
    contenedorNuevaFactura.classList.remove("hidden");
    contenedorListado.append(contenedorNuevaFactura);

    let fechaHoy = new Date();
    const dia = fechaHoy.getDate().toString().padStart(2, "0");
    const mes = (fechaHoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaHoy.getFullYear();
    console.log(anio);

    fechaHoy = anio + "-" + mes + "-" + dia;
    contenedorNuevaFactura.querySelector("[name='input-fecha-emision']").value = fechaHoy;
    console.log(fechaHoy);

    contenedorAcciones.innerHTML = "";
    const botonGuardar = document.createElement("button");
    botonGuardar.classList.add("btn-success");
    botonGuardar.addEventListener("click",(e)=>{
          e.preventDefault();
          guardarNuevaFactura(apiUrlFacturasCreate);
    });
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
    
    botonNuevoConcepto.addEventListener("click", (e) => {
      e.preventDefault();
      crearItem(contenedorNuevaFactura);
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

      
    
  }

  function editarFactura(factura) {
    console.log(factura);
    contenedorListado.innerHTML="";
    contenedorAcciones.innerHTML = "";
    const contenedorFactura = templateNuevaFactura.cloneNode(true);
    contenedorFactura.querySelector("[name = 'input-baseimponible']").value = factura.baseimponible;
    importeIva = contenedorFactura.querySelector("[name = 'input-iva']");
    contenedorFactura.classList.remove("hidden");
    const botonGuardar = document.createElement("button");
    botonGuardar.classList.add("btn-success");
    botonGuardar.addEventListener("click",(e)=>{
          e.preventDefault();
          guardarNuevaFactura(apiUrlFacturasUpdate, factura.id);
    });
    const botonNuevoConcepto = document.createElement("button");
    botonNuevoConcepto.classList.add("btn-success");
    botonGuardar.textContent = "Guardar";
    botonNuevoConcepto.textContent = "Nuevo Concepto";

    contenedorAcciones.append(botonNuevoConcepto, botonGuardar);

    const botonBuscarCliente = contenedorFactura.querySelector("#buscar-cliente-btn");
    botonBuscarCliente.addEventListener("click", (e) => {
      e.preventDefault();
      buscarCliente();
      
    })

    importeIva.addEventListener("change", () =>{    
      calcularImporteTotal();
    })

    botonNuevoConcepto.addEventListener("click", (e) => {
      e.preventDefault();
      crearItem(contenedorFactura);
    });

    contenedorFactura.querySelector("#span-cliente").textContent = factura.cliente;
    contenedorFactura.querySelector("[name='input-iva']").value= factura.iva;
    contenedorFactura.querySelector("[name='input-id-cliente']").value= factura.id_cliente;
    contenedorFactura.querySelector(".importe-total").textContent = formatoMoneda(factura.baseimponible * (1+ factura.iva/100));
    contenedorFactura.querySelector("[name='input-fecha-emision']").value= factura.fecha_emision;
    

    
    factura.items.forEach((item) => {
      crearItem(contenedorFactura, item);
      
    })

    
    contenedorListado.append(contenedorFactura);

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
  function crearItem(contenedor, datosItem) {
    console.log("creando",datosItem);
    const listadoConceptos = contenedor.querySelector(".listado-conceptos");
    const templateItem = document.querySelector("#concepto-template");
    const contenedorItem = templateItem.cloneNode(true);
    contenedorItem.classList.remove("hidden");


    contenedorItem.id = "";
    contenedorItem.classList.add("concepto-template");
    const importe = contenedorItem.querySelector("[name= 'input-importe']");
    listadoConceptos.append(contenedorItem);
    const botonEliminarItem = contenedorItem.querySelector(".eliminar-concepto");
    if(datosItem != undefined){
      contenedorItem.querySelector("[name='input-id-item']").value = datosItem.id;
      contenedorItem.querySelector("[name='descripcion-concepto']").textContent = datosItem.descripcion;
      contenedorItem.querySelector("[name='input-importe']").value = datosItem.importe;
    }
    botonEliminarItem.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("hola");
      eliminarItem(contenedorItem);
    })

    importe.addEventListener("change", () => {
      calcularImporteTotal();
    })


  }
  function calcularImporteTotal() {
    const contenedorImporte = document.querySelector(".importe-total");
    const valorImporte = document.querySelector('[name="input-baseimponible"]')
    
    const listaImportes = document.querySelectorAll("[name= 'input-importe']");
    let sumatorio = 0;
    //console.log(listaImportes);
    listaImportes.forEach(elemento => {
      //console.log(elemento.value);
      sumatorio += parseFloat(elemento.value);
    });
    valorImporte.value = sumatorio;

    sumatorio = sumatorio *(1+(importeIva.value/100));
    console.log(importeIva.value);
    
    contenedorImporte.textContent = formatoMoneda(sumatorio);
  }
  function eliminarItem(item) {    
    const idItem = item.querySelector("[name = 'input-id-item']").value;
    const facturaString1 = JSON.stringify({id : idItem });
    fetch(apiUrlFacturasDelete, {method: "POST", body:facturaString1})
      .then((respuesta) => {
        if(!respuesta.ok){
          throw new Error(`Error en la solicitud:  ${respuesta.status}`);
        }
        respuesta.json()
      })   

    item.remove();
    calcularImporteTotal();

  }
  function buscarCliente() {
    const contendorNombreCliente = document.querySelector(".cliente-vista span");
    const inputIdCCliente = document.querySelector("[name='input-id-cliente']");
    const selectContactos = document.querySelector("[name= 'contacto-select']");
    const busqueda = new Buscador(contendorNombreCliente, inputIdCCliente, selectContactos);
    
  }
  function guardarNuevaFactura(apiUrl, id, ) {

    if(!id){
      id = 0;
    }

    const factura = {
        idFactura : id,
        baseImponible: document.querySelector("[name='input-baseimponible']").value,
        iva: document.querySelector("[name='input-iva']").value,
        fecha_emision: document.querySelector("[name='input-fecha-emision']").value,
        idCliente: document.querySelector("[name='input-id-cliente']").value,
        items: []
    };

    const items = document.querySelectorAll(".concepto-template");

    items.forEach((item) => {
        factura.items.push({
            idItem : item.querySelector("[name='input-id-item']").value,
            descripcion: item.querySelector("[name='descripcion-concepto']").value,
            importe: item.querySelector("[name='input-importe']").value
        });
    });

    const facturaString = JSON.stringify(factura);

    fetch(apiUrl, {
        method: "POST",
        body: facturaString
    })
    .then((response) => {
        if (!response.ok) { // Corregido: response.ok en lugar de !response==ok
            throw new Error(`No se ha podido leer la tabla de contactos: <br> ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
      const message = data.message;
        new Modal(message, "informacion", "", "");
    })
    .catch((error) => {
        const mensajeError = `Se ha producido un error en la creacion de la factura ${error}`;
        new Modal(mensajeError, "informacion", "", ""); 
    });
  }  
  
}
doFacturas();