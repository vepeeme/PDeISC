document.addEventListener('DOMContentLoaded', () => {

  // Arrays  con los respectivos elementos que vamosa usar
  const numerosArr = [1, 2, 3, 4, 5, 6];
  const peliculasArr = ['Matrix', 'Inception', 'Avatar', 'Titanic', 'Gladiator'];
  const ultimosArr = [10, 20, 30, 40, 50, 60];

  // Listas del HTML
  const ulNums    = document.getElementById('lista-numeros');
  const ulPelis   = document.getElementById('lista-peliculas');
  const ulUltimos = document.getElementById('lista-ultimos');

  // Lugar donde se muestran los mensajes
  const msgNums    = document.getElementById('msg-numeros');
  const msgPelis   = document.getElementById('msg-peliculas');
  const msgUltimos = document.getElementById('msg-ultimos');

  // Formularios de cada elemento
  const formNums    = document.getElementById('form-numeros');
  const formPelis   = document.getElementById('form-peliculas');
  const formUltimos = document.getElementById('form-ultimos');

  // Recibe un array y crea un elemento de la lista por cada posicion del array
  function render(arr, ul) {
    ul.innerHTML = ''; // Borramos el contenido anterior de la lista
    arr.forEach(item => {
      const li = document.createElement('li'); // creamos un <li> por cada ítem
      li.textContent = item;                   // le ponemos el texto
      ul.appendChild(li);                      // lo agregamos a la <ul>
    });
  }

  // Muestra los primeros 3 elementos del array
  formNums.addEventListener('submit', e => {
    e.preventDefault();
    const copia = numerosArr.slice(0, 3); // copia los elementos
    msgNums.textContent = `Copia:`; 
    render(copia, ulNums);
  });

  // Copia los elementos desde la posición 2 hasta la 4
  formPelis.addEventListener('submit', e => {
    e.preventDefault();
    const copia = peliculasArr.slice(2, 4); // copia elementos en posiciones 2 y 3
    msgPelis.textContent = `Copia parcial:`;
    render(copia, ulPelis); 
  });

  // Copia los ultimos 3 elementos del array
  formUltimos.addEventListener('submit', e => {
    e.preventDefault();
    const copia = ultimosArr.slice(-3); // obtiene los últimos 3 elementos
    msgUltimos.textContent = `Últimos 3:`;
    render(copia, ulUltimos);
  });
});
