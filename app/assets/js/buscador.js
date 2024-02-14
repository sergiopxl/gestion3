"use strict"
console.log("buscador.js 1.");

class Buscador{

    container = document.createElement("div");
    exit = document.createElement("div");
    title = document.createElement("div");
    input = document.createElement("input");
    button = document.createElement("button");
    results = document.createElement("div");

    constructor(contenedorNombre, clienteId, contenedorContactos){

        document.querySelector("main").classList.add("blur");
        this.container.classList.add("buscador-container");
        this.exit.classList.add("buscador-exit");
        this.title.classList.add("buscador-title");
        this.input.classList.add("buscador-input");
        this.button.classList.add("btn-info");
        this.results.classList.add("buscador-results");
        this.button.textContent="Buscar Resultados";
        this.exit.textContent="X";

        this.exit.addEventListener("click", (e)=>{
            e.preventDefault();
            this.destroy();
        })
        this.container.append(this.exit, this.title, this.input, this.button, this.results);
        document.querySelector("body").append(this.container);

        this.button.addEventListener("click", (e)=>{
            e.preventDefault();
            this.results.innerHTML="";
            const parametros = "?buscar="+this.input.value;
            fetch(apiUrlClientesGet+parametros, {
                method :"GET"
            }).then((respuesta)=> {
                if(!respuesta.ok) {
                    throw new Error (`Error en la solicitud: <br> ${respuesta.status}`);                    
                }
                return respuesta.json();
            }).then((clientes) => {
                console.log(clientes)
                //this.printResultadosBusqueda(clientes);
                clientes.clientes.forEach((cliente) => {
                    console.log(cliente);
                    const nombreCliente = document.createElement("p");
                    nombreCliente.textContent = cliente.nombre;
                    nombreCliente.classList.add("cursor");                   
                    this.results.append(nombreCliente); 
                    nombreCliente.addEventListener("click", (e)=>{
                        console.log("estas clickando");
                        this.destroy();
                        contenedorNombre.textContent= cliente.nombre;
                        clienteId.value = cliente.id;
                        contenedorContactos.innerHTML = '<option value="" selected disabled> Seleccione contacto</option>';
                        cliente.contactos.forEach((contacto)=>{
                            console.log("Bucle de contactos");
                            const cont = document.createElement("option")
                            cont.value = contacto.id;
                            cont.textContent = contacto.nombre;
                            contenedorContactos.append(cont);
                        })
                         


                                 
                    })                   
                });                
            }).catch((error) =>{
                const mensajeError = `Èrror en la solicitud: <br> ${error} <br> Consulte con el servicio`;
                new Modal(mensajeError, "informacion", "", "");
            });
                       
        });
    }

    /*printResultadosBusqueda(clientes){

        clientes.forEach(element => {
            const nombreCliente = document.createElement("p");
            nombreCliente.textContent(element.nombre);
            this.results.append(nombreCliente);
        });
    }*/


    destroy() {
        document.querySelector("main").classList.remove("blur");
        this.container.remove();
      }
      
}