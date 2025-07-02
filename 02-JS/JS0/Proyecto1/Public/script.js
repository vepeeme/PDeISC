//Crea un evento DOM para la pagina para que se ejecute al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
  //Crea constante con el valor del formulario, lista de personas, menasje de  exito
  const form = document.getElementById('registroForm');
  const lista = document.getElementById('lista');
  const msg = document.getElementById('msgExito');
  //Crea un objeto que toman los valores de los campos del formulario
  const campos = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    email: document.getElementById('email'),
    pais: document.getElementById('pais'),
  };
  //Crea un objeto que toman como valor los errores de los campos del formulario
  const errores = {
    nombre: document.getElementById('err-nombre'),
    apellido: document.getElementById('err-apellido'),
    email: document.getElementById('err-email'),
    pais: document.getElementById('err-pais'),
  };
  // Evita que la pagina se recargue al enviar el formulario, y borra los errores junto con el mensaje de exito
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    Object.values(errores).forEach(e => e.textContent = '');
    msg.style.display = 'none';
    // Objeto que toma los valores de los campos del formulario y quita los espacios en blanco
    const datos = {
      nombre: campos.nombre.value.trim(),
      apellido: campos.apellido.value.trim(),
      email: campos.email.value.trim(),
      pais: campos.pais.value,
    };
    // Revisa que tenga valor los campos, si no tiene salta error con el mensaje "Campo obligatorio"
    let valido = true;
    for (let campo in datos) {
      if (!datos[campo]) {
        errores[campo].textContent = 'Campo obligatorio';
        valido = false;
      }
    }
    if (!valido) return;
    // Envia los datos al servidor y agrega la persona a la lista
    try {
      const res = await fetch('/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!res.ok) throw new Error('Error en el registro');
      const persona = await res.json();
      // Crea un elemento li con el valor de la persona y lo agrega a la lista
      const li = document.createElement('li');
      li.textContent = `${persona.nombre} ${persona.apellido} (${persona.pais})`;
      lista.appendChild(li);
      // Reinicia el formulario y muestra el mensaje de exito
      form.reset();
      campos.nombre.focus();
      msg.style.display = 'block';
    } catch (err) {
      console.error(err);
    }
  });

  // Al cargar la pagina, muestra la lista de personas registradas
  fetch('/personas')
    .then(r => r.json())
    .then(data => {
      data.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} ${p.apellido} (${p.pais})`;
        lista.appendChild(li);
      });
    });
});
