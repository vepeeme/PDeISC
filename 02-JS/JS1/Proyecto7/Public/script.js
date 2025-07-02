document.addEventListener('DOMContentLoaded', () => {
  // Arrays con los que vamos a utilizar en el formulario
  const animales = ['gato', 'perro', 'elefante'];
  const numeros  = [10, 20, 30, 50, 70];
  const ciudades = ['Barcelona', 'Lisboa', 'Valencia', 'Sevilla'];

  // Son los forumlarios de cada elemento
  const formAnimal = document.getElementById('form-animal');
  const formNumero = document.getElementById('form-numero');
  const formCiudad = document.getElementById('form-ciudad');

  // Lugar donde mostramos los mensajes
  const msgAnimal = document.getElementById('msg-animal');
  const msgNumero = document.getElementById('msg-numero');
  const msgCiudad = document.getElementById('msg-ciudad');

  //Busca en el array al elemento perro
  formAnimal.addEventListener('submit', e => {
    e.preventDefault();
    const idx = animales.indexOf('perro'); // buscamos el índice de perro
    if (idx !== -1) {
      msgAnimal.textContent = `"perro" está en la posición ${idx}.`;
    } else {
      msgAnimal.textContent = `"perro" no se encontró.`; // si no esta en el array
    }
  });

  // Busca en el array el número 50
  formNumero.addEventListener('submit', e => {
    e.preventDefault();
    const idx = numeros.indexOf(50); // buscamos el índice de 50
    if (idx !== -1) {
      msgNumero.textContent = `50 fue encontrado en la posición ${idx}.`;
    } else {
      msgNumero.textContent = `50 no está en el array.`; // si no esta en el array
    }
  });

  // Busca en el array la ciudad "Madrid"
  formCiudad.addEventListener('submit', e => {
    e.preventDefault();
    const idx = ciudades.indexOf('Madrid'); // buscamos el índice de "Madrid"
    if (idx !== -1) {
      msgCiudad.textContent = `"Madrid" está en la posición ${idx}.`;
    } else {
      msgCiudad.textContent = `"Madrid" no está en la lista de ciudades.`; // si no esta en el array
    }
  });
});
