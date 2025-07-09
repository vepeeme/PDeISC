// Obtenemos los elementos del HTML
const btnFetch = document.getElementById("enviarPorFetch");
const btnAxios = document.getElementById("enviarPorAxios");
const salida = document.getElementById("respuesta");

// Al apretar el boton enviar por Fetch activa el siguiente evento
btnFetch.addEventListener("click", () => {
  procesarEnvio("/api/registroFetch");
});

// Al apretar el boton enviar por Axios activa el siguiente evento
btnAxios.addEventListener("click", () => {
  procesarEnvio("/api/registroAxios");
});

// Toma los datos del formulario y los envía al servidor
function procesarEnvio(ruta) {
  // Obtenemos los valores de los campos
  const nombre = document.getElementById("campoNombre").value.trim();
  const correo = document.getElementById("campoCorreo").value.trim();

  // Validamos que los campos no estén vacíos
  if (!nombre || !correo) {
    mostrarMensaje("Por favor, completa todos los campos.");
    return;
  }

  // Enviamos los datos al servidor usando fetch
  fetch(ruta, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreUsuario: nombre, correo: correo }),
  })
    .then(resp => resp.json()) // Convertimos la respuesta en JSON
    .then(datos => {
      // Si recibimos un ID, mostramos el mensaje de éxito
      if (datos.id) {
        mostrarMensaje(`ID (${datos.metodo}): ${datos.id}`);
      } else {
        mostrarMensaje("No se pudo registrar.");
      }
    })
    .catch(() => mostrarMensaje("Error al conectarse al servidor."));
}

// Mustra los mensajes en pantalla
function mostrarMensaje(msj) {
  salida.textContent = msj;
}
