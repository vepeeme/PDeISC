//Crea un evento DOM para la pagina para que se ejecute al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    //Crea constante con el valor del formulario, lista de personas, menasje de  exito y el campo de cant. hijos
    const form = document.getElementById('formPersona');
    const lista = document.getElementById('listaPersonas');
    const exito = document.getElementById('msgExito');
    const campoHijos = document.getElementById('campoCantidadHijos');

    // Mustra u oculta el campo de cantidad de hijos dependiendo la opcion que se elija
    const hijosSelect = document.getElementById('tieneHijos');
    hijosSelect.addEventListener('change', () => {
      campoHijos.style.display = hijosSelect.value === 'Sí' ? 'block' : 'none';
    });
    // Crea un array con los nombres de los campos del formulario
    const campos = [
      'nombre', 'apellido', 'edad', 'nacimiento', 'sexo', 'documento',
      'estado', 'nacionalidad', 'telefono', 'email', 'tieneHijos'
    ];
    // Al enviar el forumalario evita que se recargue la pagina y quita los errores
    form.addEventListener('submit', async e => {
      e.preventDefault();
      exito.style.display = 'none';
      limpiarErrores();

      // Quita los espacios en blanco de los campos 
      const datos = Object.fromEntries(campos.map(id => [id, form[id].value.trim()]));
      // Si tiene hijos, guarda la cantidad de hijos
      if (datos.tieneHijos === 'Sí') {
        datos.cantidadHijos = form.cantidadHijos.value.trim();
      }
      // Verifica si los campos tienen bien los datos, caso contrario muestra el error
      const errores = validarCampos(datos);
      if (Object.keys(errores).length > 0) {
        mostrarErrores(errores);
        return;
      }
      // Si no tiene errores, guarda los datos en el servidor
      try {
        const resp = await fetch('/enviar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            pais: datos.nacionalidad // usamos "pais" para cumplir con main.js
          })
        });
        if (!resp.ok) throw new Error('Error al guardar');
        // Si guarda los datos bien, agrega la persona ala lista y reinicia el formulario
        const persona = await resp.json();
        agregarPersonaLista(persona);
        form.reset();
        campoHijos.style.display = 'none';
        exito.style.display = 'block';
      } catch (err) {
        console.error('Error al enviar:', err);
      }
    });
    // Revisa cada campo del formulario y se fija si tiene errores, si lo hay los muestra
    function validarCampos(data) {
      const errores = {};
      if (!data.nombre) errores.nombre = 'Nombre obligatorio.';
      if (!data.apellido) errores.apellido = 'Apellido obligatorio.';
      if (!data.edad || isNaN(data.edad)) errores.edad = 'Edad inválida.';
      if (!data.nacimiento) errores.nacimiento = 'Fecha requerida.';
      if (!data.sexo) errores.sexo = 'Seleccione un sexo.';
      if (!data.documento.match(/^\d{6,12}$/)) errores.documento = 'Documento inválido.';
      if (!data.estado) errores.estado = 'Estado civil requerido.';
      if (!data.nacionalidad) errores.nacionalidad = 'Ingrese una nacionalidad.';
      if (!data.telefono.match(/^\d{7,15}$/)) errores.telefono = 'Teléfono inválido.';
      if (!data.email.match(/^\S+@\S+\.\S+$/)) errores.email = 'Email inválido.';
      if (!data.tieneHijos) errores.tieneHijos = 'Seleccione si tiene hijos.';
      if (data.tieneHijos === 'Sí' && (!data.cantidadHijos || isNaN(data.cantidadHijos))) {
        errores.cantidadHijos = 'Ingrese cantidad válida.';
      }
      return errores;
    }
    // Muestra los errores de los respectivos campos debajo del mismo
    function mostrarErrores(errores) {
      for (const campo in errores) {
        document.getElementById(`err-${campo}`).textContent = errores[campo];
      }
    }
    // Quita los errores de los campos
    function limpiarErrores() {
      document.querySelectorAll('.error').forEach(el => el.textContent = '');
    }
    // Agrega una etiqueta li con el valor de la persona a la lista
    function agregarPersonaLista(p) {
      const li = document.createElement('li');
      li.textContent = `${p.nombre} ${p.apellido}`;
      lista.appendChild(li);
    }
  
    // Al cargar la pagina, muestra la lista de personas registradas
    fetch('/personas')
      .then(res => res.json())
      .then(data => {
        data.forEach(agregarPersonaLista);
      });
  });
  