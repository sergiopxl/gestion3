"use strict"
console.log("facturas.js 1.1");

function doFacturas(){
  
  const contenedorListado = document.querySelector("main");
  const templateFactura = document.querySelector("#factura-template");
  /*
    - selección de elementos html
    - declaración de variables de ambito general 
    - eventos de acciones generales del apartado
  */

 getFacturas();

 function getFacturas(){

  fetch(apiUrlFacturasGet+"?listado=1", {method: "GET"})
  .then((respuesta) => {
    if(!respuesta.ok){
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

 function printFacturas(facturas){
  console.log(facturas);
    contenedorListado.innerHTML = "";

    facturas.forEach((factura) => {
      console.log("klk puñeta");

      const facturasContenedor = templateFactura.cloneNode(true);
      facturasContenedor.id ="";
      facturasContenedor.classList.remove("hidden");
      const contenedorItems = facturasContenedor.querySelector(".factura-items");

      const numeroFactura = facturasContenedor.querySelector(".factura-numero strong").textContent = factura.id;
      const clienteFactura = facturasContenedor.querySelector(".factura-cliente strong").textContent = factura.cliente;
      const estadoFactura = facturasContenedor.querySelector(".factura-estado strong").textContent = factura.estado;
      const importeFactura = facturasContenedor.querySelector(".factura-importe strong").textContent = formatoMoneda(factura.baseimponible * (1+factura.iva/100));
      const descripcionFactura = facturasContenedor.querySelector(".factura-descripcion").textContent = factura.descricion;

      factura.items.forEach((item) => {
        const templateItems = facturasContenedor.querySelector("#factura-item-template");
        const rowItems = templateItems.cloneNode(true);
        rowItems.id="";
        rowItems.classList.remove("hidden");

        rowItems.querySelector(".item-descripcion").textContent = item.descripcion;
        rowItems.querySelector(".item-importe").textContent = formatoMoneda(parseFloat(item.importe + 0));
        console.log(item.importe);

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
 function nuevaFactura(){

  /*
    - limpiar main
    - clonado de formulario factura , eliminar id, quita clase oculto, añadir clase
    - evento botón nuevoConcepto -> crearItem(contenedorItems)
    - evento boton buscar cliente -> buscarCliente()
    - evento botón guardar -> guardarNuevaFactura()
  */

  function guardarNuevaFactura(){    
    /*
      - recogida de datos del formulario creando un JSON, no se puede hacer con un FormData.
      - envio de datos al API POST, los datos del body han de ir en formato JSON pero convertidos a cadena.
      - información resultado del alta
    */
  }

 }

 function editarFactura(factura){
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
   function guardarEdicionFactura(){
     /*
      - recogida de datos del formulario creando un JSON, no se puede hacer con un FormData.
      - envio de datos al API POST, los datos del body han de ir en formato JSON pero convertidos a cadena.
      - información resultado del alta
    */
   }
 }

 function crearItem(contenedorItems,datoItem){ 
    /*
      - clonado del template de item desde el objeto que recibimos por parametro , eliminar id, quita clase oculto, añadir clase
      - evento cambio de importe -> calcularImporteTotal();
      - evento eliminar item -> eliminarItem(item) -> calcularImporteTotal(); 
      - appen item al contendorItems
    */
 }
 function buscarCliente(){
    /*
      - mostrar modal con buscador
      - evento boton buscar -> getClientes(consulta)
    */
   function getClientes(consulta){
    /*
      - consulta al api 
      - mostrar resultados
      - evento seleccionar resultado
    */
   }
 }
} 
doFacturas();