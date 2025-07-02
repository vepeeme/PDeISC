document.addEventListener('DOMContentLoaded', () => {

  // Creamos dos arrays con datos ya cargados
  let animales = ['Perro', 'Gato', 'Elefante'];
  let compras = ['Leche', 'Pan', 'Huevos'];

  // Obtenemos las listas HTML donde vamos a mostrar animales y compras
  const ulAnimales = document.getElementById('lista-animales');
  const ulCompras  = document.getElementById('lista-compras');

  // Obtenemos los elementos donde mostraremos mensajes
  const msgAnimal  = document.getElementById('msg-animal');
  const msgCompra  = document.getElementById('msg-compra');

  // Obtenemos los formularios del HTML
  const formAnimal = document.getElementById('form-animal'); // elimina último animal
  const formCompra = document.getElementById('form-compra'); // elimina último producto
  const formVaciar = document.getElementById('form-vaciar'); // vacía ambos arrays

  // Esta función actualiza las listas en pantalla
  function render() {
    // Borramos lo que ya estaba anteriormente 
    ulAnimales.innerHTML = '';
    ulCompras.innerHTML  = ''; 

    // Recorremos el array de animales y los mostramos como lista
    animales.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      ulAnimales.appendChild(li);
    });

    // Recorremos el array de compras y tambien lo mostramos
    compras.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      ulCompras.appendChild(li);
    });
  }

  // Mostramos la lista apenas inicia la página
  render();

  // Cuando se envía el formulario para eliminar un animal
  formAnimal.addEventListener('submit', e => {
    e.preventDefault(); 

    // Si el array no está vacío, eliminamos el último elemento
    if (animales.length > 0) {
      const eliminado = animales.pop(); // quitamos el último
      msgAnimal.textContent = `Animal eliminado: ${eliminado}`;
    } else {
      msgAnimal.textContent = 'No quedan animales.';
    }

    render();
  });

  // Cuando se envía el formulario para eliminar un producto de compras
  formCompra.addEventListener('submit', e => {
    e.preventDefault();

    // Si el array no está vacío, eliminamos el último elemento
    if (compras.length > 0) {
      const eliminado = compras.pop();
      msgCompra.textContent = `Producto eliminado: ${eliminado}`;
    } else {
      msgCompra.textContent = 'No quedan productos.';
    }

    render();
  });

  // Cuando se envía el formulario para vaciar ambas listas
  formVaciar.addEventListener('submit', e => {
    e.preventDefault();

    // Vaciamos ambos arrays
    while (animales.length > 0) animales.pop();
    while (compras.length > 0) compras.pop();

    // Muestra un mensaje de que se han borrado los elementos
    msgAnimal.textContent = 'Animales vaciados.';
    msgCompra.textContent = 'Compras vaciadas.';

    render();
  });
});
