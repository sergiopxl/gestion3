"use strict"

console.log("navigation.js 1.1");

function doNavigation(){
  const apartados = [
    {
      literal : "Inicio",
      url : "../../modules/inicio/index.html"
    },
    {
      literal : "Clientes",
      url : "../../modules/clientes/index.html"
    },
    {
      literal : "Proveedores",
      url : "../../modules/proveedores/index.html"
    },
    {
      literal : "Facturas",
      url : "../../modules/facturas/index.html"
    },
    {
      literal : "Comunicaciones",
      url : "../../modules/comunicaciones/index.html"
    },
    {
      literal : "Informes",
      url : "../../modules/informes/index.html"
    },
    
  ];
  const navegacionContenedor = document.querySelector("#navegacion-principal ul");

  apartados.forEach(apartado=>{
    const navegacionLi = document.createElement("li");
    const navegacionA = document.createElement("a");
    navegacionA.textContent = apartado.literal;
    navegacionA.href = apartado.url;
    navegacionLi.append(navegacionA);
    navegacionContenedor.append(navegacionLi);
  });

}

doNavigation();