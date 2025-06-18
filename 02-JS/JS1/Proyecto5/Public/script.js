document.addEventListener('DOMContentLoaded', () => {

  // Arrays con los valores
  let letras = ['A','B','C','D','E'];
  let nombres = ['Ana','Juan','Luis'];
  let reemplazo = ['X','Y','Z','W'];

  // Son las listas del HTML
  const ulLetras    = document.getElementById('lista-letras');
  const ulNombres   = document.getElementById('lista-nombres');
  const ulReemplazo = document.getElementById('lista-reemplazo');

  // Son los lugares donde se muestran los mensajes
  const msgEliminar   = document.getElementById('msg-eliminar');
  const msgInsertar   = document.getElementById('msg-insertar');
  const msgReemplazar = document.getElementById('msg-reemplazar');

  // Son los formularios de cada elemento
  const formEliminar   = document.getElementById('form-eliminar');
  const formInsertar   = document.getElementById('form-insertar');
  const formReemplazar = document.getElementById('form-reemplazar');

  // Son los inputs de cada formulario
  const inputNombre = document.getElementById('input-nombre');
  const inputR1     = document.getElementById('input-r1');
  const inputR2     = document.getElementById('input-r2');

  //  Agrega un elemento a la lista
  function render(arr, ul) {
    ul.innerHTML = ''; // Borra la lista
    arr.forEach(item => {
      const li = document.createElement('li'); // creamos un <li> para cada ítem
      li.textContent = item;                   // le asignamos el contenido
      ul.appendChild(li);                      // lo agregamos a la <ul>
    });
  }
  // Muestra los valores iniciales de los arrays
  render(letras, ulLetras);
  render(nombres, ulNombres);
  render(reemplazo, ulReemplazo);

  // Elimina dos elementos desde la posicion 1 del array
  formEliminar.addEventListener('submit', e => {
    e.preventDefault();
    const removed = letras.splice(1, 2);
    msgEliminar.textContent = `Eliminados: ${removed.join(', ')}`;
    render(letras, ulLetras);
  });

  // Agrega un nombre en la posición 2 del array sin borrar ninguna
  formInsertar.addEventListener('submit', e => {
    e.preventDefault();
    const nuevo = inputNombre.value.trim(); 
    if (!nuevo) return; // si no escribió nada finaliza la función
    nombres.splice(1, 0, nuevo); // insertamos en la posición 1 sin eliminar nada
    msgInsertar.textContent = `Insertado: ${nuevo}`;
    inputNombre.value = ''; // Borra el campo
    render(nombres, ulNombres);
  });

  // ========== 3) REEMPLAZAR ELEMENTOS EN LA POSICIÓN 2 ==========
  // Reemplaza 2 elementos por otros 2 nuevos
  formReemplazar.addEventListener('submit', e => {
    e.preventDefault();
    const r1 = inputR1.value.trim(); // Primer elemento
    const r2 = inputR2.value.trim(); // Segundo elemento
    if (!r1 || !r2) return; // si alguno está vacío finaliza la función
    const old = reemplazo.splice(2, 2, r1, r2); // Reemplaza 2 elementos a partir de la posicion 2 por los nuevos
    msgReemplazar.textContent = `Reemplazados: ${old.join(', ')} por ${r1}, ${r2}`; 
    inputR1.value = ''; //Borra los campos
    inputR2.value = '';
    render(reemplazo, ulReemplazo); 
  });
});
