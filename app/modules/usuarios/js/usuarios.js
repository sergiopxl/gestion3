"use strict";
console.log("usuarios.js 1.1");

function initUsuarios() {
  // Selecciona el título y lo actualiza
  const titulo = document.querySelector("#h1-apartado");
  titulo.textContent = "Listado usuarios";
  
  // Selecciona elementos del DOM
  const container = document.querySelector("main");
  const usuarioRow = document.querySelector("#usuario-row");
  const formulario = document.querySelector("#usuario-form");

  // Agrega un evento al botón de nuevo usuario
  const botonNuevoUsuario = document.querySelector("#nuevo-usuario-btn");
  botonNuevoUsuario.addEventListener("click", () => {
    doNuevoUsuario();
  });

  // Obtiene y muestra los usuarios
  getUsuarios();

  function getUsuarios() {
    // Realiza una solicitud GET para obtener los usuarios
    fetch(apiUrlUsuariosGet, { method: "GET" }).then((response) => {
      response.json().then((data) => {
        // Llama a la función para mostrar los usuarios
        printUsuarios(data);
      });
    });
  }

  function printUsuarios(usuarios) {
    // Itera sobre los usuarios y crea una fila para cada uno
    usuarios.forEach((usuario) => {
      const newrow = usuarioRow.cloneNode(true);
      newrow.id = "";
      newrow.classList.remove("hidden");
      newrow.querySelector(".usuario-id").textContent = usuario.id;
      newrow.querySelector(".usuario-nombre").textContent = usuario.nombre;
      newrow.querySelector(".usuario-email").textContent = usuario.email;
      newrow.querySelector(".usuario-role").textContent = usuario.role;
      newrow.querySelector("img").src = usuario.avatar;
      newrow.querySelector(".editar-usuario").addEventListener("click",()=>editarUsuario(usuario))
      container.append(newrow);
    });
  }

  function doNuevoUsuario() {
    // Elimina el contenido del contenedor
    container.innerHTML = "";
    // Clona el formulario para un nuevo usuario y lo muestra
    const formularioNuevoUsuario = formulario.cloneNode(true);
    formularioNuevoUsuario.id = "";
    formularioNuevoUsuario.classList.remove("hidden");
    // Agrega un evento para alternar la visibilidad de la contraseña
    /* const botonSwitchPass = formularioNuevoUsuario.querySelector(".switch-pass");
    botonSwitchPass.addEventListener("click", () => {
      const campoPassword = formularioNuevoUsuario.querySelector('[name="password-usuario"]');
      let tipo;
      // Alterna entre tipo de campo "password" y "text"
      campoPassword.getAttribute("type") == "password" ? (tipo = "text") : (tipo = "password");
      campoPassword.setAttribute("type", tipo);
    });*/

    // Agrega un evento para guardar el formulario
    const botonGuardar = formularioNuevoUsuario.querySelector(".boton-guardar-form");
    botonGuardar.addEventListener("click", (e) => {
      e.preventDefault();
      // Llama a la función para guardar el formulario
      guardarFormulario(apiUrlUsuariosPost, formularioNuevoUsuario);
    });

    container.append(formularioNuevoUsuario);
  }
  function editarUsuario(usuario){
    const formularioEdicion = formulario.cloneNode(true);     

  }
  function guardarFormulario(apiUrl, formulario) {
    // Crea un objeto FormData con los datos del formulario
    const datos = new FormData(formulario);
    // Obtiene el archivo adjunto (si lo hay)
    const archivo = formulario.querySelector('input[type="file"]').files[0];

    // Agrega el archivo al objeto FormData
    datos.append("archivo", archivo);

    // Realiza una solicitud POST para guardar el formulario
    fetch(apiUrl, { method: "POST", body: datos })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Muestra una modal con la respuesta del servidor
        new Modal(data, "informacion", "", "");
      });
  }

}

// Inicia la función principal
initUsuarios();
