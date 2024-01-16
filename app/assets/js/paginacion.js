"use strict";

console.log("paginacion.js 1.2");

/*function doPaginacion(actual, resultadosPorPagina, resultados, accion){

}*/
function doPaginacion(actual, resultadosPorPagina, resultados, accion) {
  class ElementoPaginacion {
    valor;
    contenedor = document.createElement("div");
    constructor(actual, valor) {
      if (actual) {
        this.contenedor.classList.add("elemento-paginacion-actual");
      }
      this.contenedor.classList.add("elemento-paginacion");
      this.contenedor.textContent = this.valor = valor;
      this.contenedor.addEventListener("click", () => {
        this.ejecutaAccion();
      });
    }
    ejecutaAccion() {
      accion(this.valor);
    }
  }
  console.log(document.querySelector("#paginacion"));

  const paginacionContenedor = document.querySelector("#paginacion");
  
  paginacionContenedor.innerHTML = "";
  const cantidadElementos = Math.ceil(resultados / resultadosPorPagina);
  for (let i = 1; i <= cantidadElementos; i++) {
    let nuevoElemento;
    if (actual == i) {
      nuevoElemento = new ElementoPaginacion(true, i);
    } else {
      nuevoElemento = new ElementoPaginacion(false, i);
    }
    paginacionContenedor.append(nuevoElemento.contenedor);
  }
}
