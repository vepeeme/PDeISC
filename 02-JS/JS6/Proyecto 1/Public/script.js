// Obtenemos los elementos del HTML 
const lista    = document.getElementById('lista');
const btnFetch = document.getElementById('btnFetch');
const btnAxios = document.getElementById('btnAxios');

// Al hacer clic en el boton ver con fetch activa el siguiente evento
btnFetch.addEventListener('click', () => {
  fetch('/api/users-fetch')
    .then(res => res.json())        // Convertimos la respuesta a JSON
    .then(users => mostrar(users))  // Mostramos los usuarios en pantalla
    .catch(err => console.error(err));
});

// Al hacer clic en el boton ver con axios activa el siguiente evento
btnAxios.addEventListener('click', () => {
  fetch('/api/users-axios')
    .then(res => res.json())    // Convertimos la respuesta a JSON  
    .then(users => mostrar(users))  // Mostramos los usuarios en pantalla
    .catch(err => console.error(err));
});

// Función que recibe los usuarios y los muestra como lista en pantalla
function mostrar(users) {
  lista.innerHTML = ''; // Vaciamos cualquier resultado anterior

  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.name} — ${u.email}`;
    lista.appendChild(li);
  });
}
