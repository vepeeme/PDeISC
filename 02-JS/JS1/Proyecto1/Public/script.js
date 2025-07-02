// Esperamos a que toda la página esté cargada antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

  // Creamos tres arrays vacíos donde vamos a guardar lo que el usuario escriba
  const frutas = [];
  const amigos = [];
  const numeros = [];

  // Obtenemos el formulario y el botón para mostrar los datos
  const form = document.getElementById('formulario');
  const mostrarBtn = document.getElementById('mostrar');

  // Obtenemos las listas del HTML donde vamos a mostrar frutas, amigos y números
  const ulFrutas = document.getElementById('lista-frutas');
  const ulAmigos = document.getElementById('lista-amigos');
  const ulNumeros = document.getElementById('lista-numeros');

  // Cuando el usuario envía el formulario
  form.addEventListener('submit', e => {
    e.preventDefault(); 

    // Leemos los valores de los tres campos de frutas
    const f1 = document.getElementById('fruta1').value.trim();
    const f2 = document.getElementById('fruta2').value.trim();
    const f3 = document.getElementById('fruta3').value.trim();

    // Leemos los valores de los tres campos de amigos
    const a1 = document.getElementById('amigo1').value.trim();
    const a2 = document.getElementById('amigo2').value.trim();
    const a3 = document.getElementById('amigo3').value.trim();

    // Leemos el número y lo convertimos a tipo numérico
    const numVal = Number(document.getElementById('numero').value);

    // Verificamos que ningún campo esté vacío y que el número sea válido
    if ([f1, f2, f3].some(f => f === '') ||
        [a1, a2, a3].some(a => a === '') ||
        isNaN(numVal)) {
      alert('Completá todos los campos correctamente.');
      return; // Si algo está mal, detenemos todo
    }

    // Agregamos las frutas al array usando push
    frutas.push(f1, f2, f3);

    // Agregamos los amigos al array
    amigos.push(a1, a2, a3);

    // Solo agregamos el número si es el primero o si es mayor que el último ingresado
    if (numeros.length === 0 || numVal > numeros[numeros.length - 1]) {
      numeros.push(numVal);
    } else {
      // Si el número no es mayor al anterior, no se agrega y se muestra un mensaje
      alert(`El número (${numVal}) no es mayor al anterior (${numeros[numeros.length - 1]}). No se agregó.`);
    }

    form.reset();
    document.getElementById('fruta1').focus(); 
  });

  // Cuando se hace clic en el botón "Mostrar"
  mostrarBtn.addEventListener('click', () => {
    // Borramos las listas para que no se dupliquen los datos al mostrarlos
    ulFrutas.innerHTML = '';
    ulAmigos.innerHTML = '';
    ulNumeros.innerHTML = '';

    // Recorremos el array de frutas y creamos un <li> por cada una
    frutas.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      ulFrutas.appendChild(li);
    });

    // Recorremos el array de amigos y los mostramos en la lista
    amigos.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      ulAmigos.appendChild(li);
    });

    // Recorremos el array de números y los mostramos en la lista
    numeros.forEach(n => {
      const li = document.createElement('li');
      li.textContent = n;
      ulNumeros.appendChild(li);
    });
  });
});
