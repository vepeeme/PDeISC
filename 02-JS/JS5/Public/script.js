// Elementos del formulario
const formulario = document.getElementById('formulario');
const btnMostrar = document.getElementById('btnMostrar');

// Array que almacenará los animales registrados
const lista = [];

// Al enviar el formulario, se activa el siguiente evento
formulario.addEventListener('submit', e => {
  e.preventDefault();

  // Obtener valores del formulario y convertirlos a los tipos correctos
  const IdAnimal     = Number(document.getElementById('IdAnimal').value);
  const nombre       = document.getElementById('nombre').value.trim();
  const JaulaNumero  = Number(document.getElementById('JaulaNumero').value);
  const IdTypeAnimal = Number(document.getElementById('IdTypeAnimal').value);
  const peso         = parseFloat(document.getElementById('peso').value);

  // Validar que todos los campos estén completos y correctos
  if (!IdAnimal || !nombre || !JaulaNumero || !IdTypeAnimal || !peso) {
    alert('Completa todos los campos.');
    return;
  }

  // Agregar el animal a la lista como objeto
  lista.push({ IdAnimal, nombre, JaulaNumero, IdTypeAnimal, peso });

  formulario.reset();
});

// Al hacer clic en el botón Mostrar datos, se activa el siguiente evento
btnMostrar.addEventListener('click', () => {
  // Elimina todo el contenido del documento y usa document.write()
  document.body.innerHTML = '';
  document.write('<h1>Datos del Zoológico</h1>');

  // Verificar si hay datos cargados
  if (lista.length === 0) {
    document.write('<p>No hay animales registrados.</p>');
    return;
  }
  //  Tabla con todos los animales registrados
  document.write(`
    <table border="1" cellpadding="6" style="margin:auto;border-collapse:collapse;">
      <tr><th>ID</th><th>Nombre</th><th>Jaula</th><th>Tipo</th><th>Peso (kg)</th></tr>
      ${lista.map(a => `
        <tr>
          <td>${a.IdAnimal}</td>
          <td>${a.nombre}</td>
          <td>${a.JaulaNumero}</td>
          <td>${a.IdTypeAnimal}</td>
          <td>${a.peso.toFixed(2)}</td>
        </tr>`).join('')}
    </table><br>
  `);


  // Cantidad de animales en jaula 5 con peso < 3kg
  const countB = lista.filter(a => a.JaulaNumero === 5 && a.peso < 3).length;

  // Cantidad de felinos en jaulas 2 a 5
  const countC = lista.filter(a =>
    a.IdTypeAnimal === 1 && a.JaulaNumero >= 2 && a.JaulaNumero <= 5
  ).length;

  // Lista de nombres de animales en jaula 4 con peso < 120kg
  const nombresD = lista
    .filter(a => a.JaulaNumero === 4 && a.peso < 120)
    .map(a => a.nombre)
    .join(', ') || 'Ninguno';

  // Muestra los resultados
  document.write(`<p><b>b)</b> Jaula 5 con peso <3kg: ${countB}</p>`);
  document.write(`<p><b>c)</b> Felinos jaulas 2–5: ${countC}</p>`);
  document.write(`<p><b>d)</b> Animales en jaula 4 peso <120kg: ${nombresD}</p>`);
});
