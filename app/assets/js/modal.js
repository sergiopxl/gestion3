"use strict";
console.log("modal.js 1.1");

// Modal CONFIRMACION / INFORMACIÓN.
// Se usa por ejemplo para confirmar operaciones de tipo alta, borrado y modificación de datos
// Admite la ejecución de funciones callback
// @params 
// texto : string 
// tipo : string | valores : "confirmacion","informacion"
// accion : function() // función que se ejecuta al aceptar una operación
// params : Any // parametros para ejecutar la función guardada en el paremetro accion

class Modal {
  contendor = document.createElement("div");
  contenido = document.createElement("div");
  titularContenedor = document.createElement("div");
  botonera = document.createElement("div");
  botonAceptar = document.createElement("button");
  botonCancelar = document.createElement("button");
  
  constructor(texto, tipo, accion, params) {

    this.contendor.classList.add("modal-contenedor");
    this.contenido.classList.add("modal-contenido");
    this.contenido.innerHTML = `<p>${texto}</p>`;
    this.titularContenedor.classList.add("modal-titular");

    this.botonera.classList.add("botonera-modal");
    this.botonAceptar.classList.add("btn-aceptar");
    this.botonAceptar.textContent = "Aceptar";
    this.botonCancelar.classList.add("btn-cancelar");
    this.botonCancelar.textContent = "Cancelar";

    if (tipo == "confirmacion") {
      this.botonAceptar.addEventListener("click", (e) => {
        e.preventDefault();
        accion(params);
        this.destroy();
      });
      this.botonCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        this.destroy();
      });
      this.botonera.append(this.botonAceptar, this.botonCancelar);
    }

    if(tipo == "informacion"){
   
      this.botonera.append(this.botonAceptar);
      this.botonAceptar.addEventListener("click", (e) => {
        e.preventDefault();
        this.destroy();
      });
    }

    this.contendor.append(this.titularContenedor, this.contenido, this.botonera);
    document.querySelector("body").append(this.contendor);

  }

  destroy() {
    this.contendor.remove();
  }

}
