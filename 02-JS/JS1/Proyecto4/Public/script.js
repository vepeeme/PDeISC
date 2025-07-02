document.addEventListener('DOMContentLoaded', () => {
  // Arrays con los datos
  let numeros = [10, 20, 30, 40, 50];
  let mensajes = [
    "Hola ¿cómo estás?",
    "Bien",
    "¿Que haces?",
    "Nada."
  ];
  let cola = ["Ana", "Luis", "María", "Pedro"];

  // Son los elementos de las listas
  const ulNumeros  = document.getElementById('lista-numeros');
  const ulMensajes = document.getElementById('lista-mensajes');
  const ulCola     = document.getElementById('lista-cola');

  // Son los mensajes que se muestran en la lista
  const msgNumero  = document.getElementById('msg-numero');
  const msgMensaje = document.getElementById('msg-mensaje');
  const msgCola    = document.getElementById('msg-cola');

  // Son los formularios de cada elemento
  const formNumero  = document.getElementById('form-numero');
  const formMensaje = document.getElementById('form-mensaje');
  const formCola    = document.getElementById('form-cola');

  // Función que muestra en pantalla los elementos de un array dentro de una lista UL
  function render(arr, ul) {
    ul.innerHTML = ''; // Borra lo que había antes
    arr.forEach(item => {
      const li = document.createElement('li'); // Creamos un ítem de lista
      li.textContent = item; // Le damos el texto correspondiente
      ul.appendChild(li); // Lo agregamos a la lista UL
    });
  }

  // Mostramos las listas por primera vez apenas carga la página
  render(numeros, ulNumeros);
  render(mensajes, ulMensajes);
  render(cola, ulCola);

  // Cuando se envía el formulario de numero, quitamos el primero de la lista
  formNumero.addEventListener('submit', e => {
    e.preventDefault(); 

    if (numeros.length > 0) {
      const first = numeros.shift(); // Quitamos el primer número del array
      msgNumero.textContent = `Número eliminado: ${first}`;
    } else {
      msgNumero.textContent = 'No quedan números.'; // Si está vacío
    }

    render(numeros, ulNumeros); 
  });

  // Cuando se envía el formulario de mensajes, quitamos el primero
  formMensaje.addEventListener('submit', e => {
    e.preventDefault();

    if (mensajes.length > 0) {
      const first = mensajes.shift(); // Quitamos el primer mensaje
      msgMensaje.textContent = `Mensaje eliminado: "${first}"`;
    } else {
      msgMensaje.textContent = 'No quedan mensajes.';//Si esta vacío
    }

    render(mensajes, ulMensajes);
  });

  // Cuando se envía el formulario de cola, atendemos al primero
  formCola.addEventListener('submit', e => {
    e.preventDefault();

    if (cola.length > 0) {
      const atendido = cola.shift(); // Quitamos el primer nombre
      msgCola.textContent = `Atendiendo a: ${atendido}`;
    } else {
      msgCola.textContent = 'La cola está vacía.';//Si esta vacío
    }

    render(cola, ulCola); 
  });
});
