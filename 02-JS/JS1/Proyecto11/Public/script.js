// Array con los que vamos a utilizar en este formulario
let numeros = [];
let palabras = [];
const usuarios = [
  { nombre: "Ana", activo: true },
  { nombre: "Luis", activo: false },
  { nombre: "Sofía", activo: true },
  { nombre: "Carlos", activo: false },
  { nombre: "Laura", activo: true }
];

// Agrega un evento al enviar el formulario de números
document.getElementById('formNumeros').addEventListener('submit', e => {
  e.preventDefault();
  const num = parseInt(document.getElementById('numeroInput').value); // Convierte el valor ingresado a número
  numeros.push(num); // Agrega el número al array
  document.getElementById('numeroInput').value = ''; // Borra el interior del campo input
});

// Agrega un evento al hacer clic en el botón de filtrar números
document.getElementById('filtrarNumeros').addEventListener('click', () => {
  const resultado = numeros.filter(n => n > 10); // Filtra los números > 10
  const lista = document.getElementById('listaNumeros');
  lista.innerHTML = ''; // Borra la lista antes de mostrar nuevos resultados
  resultado.forEach(n => {
    const li = document.createElement('li'); // Crea un nuevo elemento de lista
    li.textContent = n; // agrega el numero dentro del elemento
    lista.appendChild(li); 
  });
});


// Asigna un evento al enviar el formulario de palabras
document.getElementById('formPalabras').addEventListener('submit', e => {
  e.preventDefault(); 
  const palabra = document.getElementById('palabraInput').value.trim(); // Elimina espacios
  if (palabra) palabras.push(palabra); // Agrega si no está vacía
  document.getElementById('palabraInput').value = ''; // Borra el interior el campo
});

// Asigna un evento al hacer clic en el botón de filtrar palabras
document.getElementById('filtrarPalabras').addEventListener('click', () => {
  const resultado = palabras.filter(p => p.length > 5); // Filtra palabras mayores a 5 letras
  const lista = document.getElementById('listaPalabras');
  lista.innerHTML = ''; // Borra la lista
  resultado.forEach(p => {
    const li = document.createElement('li'); // Crea un nuevo elemento de lista
    li.textContent = p; // agrega el valor del elemento dentro de la lista
    lista.appendChild(li);
  });
});

// Agrega un evento al enviar el formulario de usuarios
document.getElementById('mostrarUsuarios').addEventListener('click', () => {
  const lista = document.getElementById('listaUsuarios');
  lista.innerHTML = ''; // Borra la lista

  usuarios.forEach(usuario => {
    const li = document.createElement('li');
    li.textContent = `${usuario.nombre} - ${usuario.activo ? "Activo" : "Inactivo"}`;
    li.style.color = usuario.activo ? "green" : "red"; // Si esta activo es verde, si no es rojo
    lista.appendChild(li); // Agrega usuario a la lista
  });
});
