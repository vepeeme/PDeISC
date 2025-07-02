document.addEventListener('DOMContentLoaded', () => {

  // Creamos los arrays
  const colores = [];
  const tareas = ['Pagar facturas', 'Enviar email'];
  const usuarios = ['Alice', 'Bob'];

  // Obtenemos los elementos del formulario
  const formColores = document.getElementById('form-colores');
  const ulColores   = document.getElementById('lista-colores');

  const formTareas  = document.getElementById('form-tareas');
  const inputTarea  = document.getElementById('input-tarea');
  const ulTareas    = document.getElementById('lista-tareas');

  const formUsuarios = document.getElementById('form-usuarios');
  const inputUser    = document.getElementById('input-usuario');
  const ulUsuarios   = document.getElementById('lista-usuarios');

  // Mostramos en pantalla lo que hay en cada array al cargar la página
  renderList(colores, ulColores);
  renderList(tareas, ulTareas);
  renderList(usuarios, ulUsuarios);

  // Función general para mostrar cualquier array en su respectiva lista HTML
  function renderList(arr, ul) {
    ul.innerHTML = '';
    arr.forEach(item => {
      const li = document.createElement('li'); 
      li.textContent = item; 
      ul.appendChild(li);
    });
  }

  //Formulario de colores
  formColores.addEventListener('submit', e => {
    e.preventDefault(); 

    // Si todavía no agregamos colores, los insertamos al principio
    if (colores.length === 0) {
      colores.unshift('Rojo', 'Verde', 'Azul');
      renderList(colores, ulColores);
    }
  });

  //Formulario de tareas urgentes
  formTareas.addEventListener('submit', e => {
    e.preventDefault();

    const tarea = inputTarea.value.trim(); // leemos lo que escribió el usuario

    if (!tarea) return; // si no escribió nada, termina la funcion

    tareas.unshift(`URGENTE: ${tarea}`); // agregamos al principio la tarea puesta
    inputTarea.value = ''; // limpiamos el input
    inputTarea.focus();   
    renderList(tareas, ulTareas); 
  });

  // Formulario de usuarios
  formUsuarios.addEventListener('submit', e => {
    e.preventDefault();

    const user = inputUser.value.trim(); // leemos el nombre del usuario

    if (!user) return; // si no hay nada escrito termina la función

    usuarios.unshift(user); // lo agregamos al principio de la lista
    inputUser.value = ''; // Borramos el campo
    inputUser.focus();
    renderList(usuarios, ulUsuarios); // mostramos la lista actualizada
  });
});
