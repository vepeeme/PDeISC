// Array que almacena los datos de los usuarios
let datosUsuarios = [];

// Al inicia pedimos la lista completa de usuarios
fetch("/api/todos-los-usuarios")
  .then(res => res.json())
  .then(info => {
    datosUsuarios = info;
    renderizarLista(info);
  })
  .catch(() => {
    document.getElementById("zonaUsuarios").textContent = "No se pudieron cargar los usuarios.";
  });

// Evento que se activa al escribir en el campo de texto
document.getElementById("filtroNombre").addEventListener("input", (evento) => {
  const texto = evento.target.value.toLowerCase();

  // Filtramos por coincidencias en el nombre
  const filtrados = datosUsuarios.filter(persona =>
    persona.name.toLowerCase().includes(texto)
  );

  renderizarLista(filtrados);
});

// Muestra los nombres en una lista 
function renderizarLista(lista) {
  const contenedor = document.getElementById("zonaUsuarios");
  contenedor.innerHTML = "";

  lista.forEach(usuario => {
    const item = document.createElement("li");
    item.textContent = usuario.name;
    contenedor.appendChild(item);
  });
}
