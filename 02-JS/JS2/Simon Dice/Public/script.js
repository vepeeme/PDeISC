document.addEventListener("DOMContentLoaded", () => {
  const colores = ['verde', 'rojo', 'amarillo', 'azul'];
  let secuencia = [];
  let secuenciaJugador = [];
  let nivel = 0;
  let puntaje = 0;

  const botones = {
    verde: document.getElementById('verde'),
    rojo: document.getElementById('rojo'),
    amarillo: document.getElementById('amarillo'),
    azul: document.getElementById('azul')
  };

  const botonIniciar = document.getElementById('iniciar');
  const botonReiniciar = document.getElementById('reiniciar');
  const mensaje = document.getElementById('mensaje');
  const textoPuntaje = document.getElementById('puntaje');

  function resaltar(color) {
    const boton = botones[color];
    boton.classList.add('activo');
    setTimeout(() => boton.classList.remove('activo'), 500);
  }

  function siguienteNivel() {
    secuenciaJugador = [];
    nivel++;
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    secuencia.push(colorAleatorio);
    mostrarSecuencia();
  }

  function mostrarSecuencia() {
    let i = 0;
    const intervalo = setInterval(() => {
      resaltar(secuencia[i]);
      i++;
      if (i >= secuencia.length) clearInterval(intervalo);
    }, 700);
  }

  function manejarClic(color) {
    secuenciaJugador.push(color);
    resaltar(color);

    const indice = secuenciaJugador.length - 1;
    if (secuenciaJugador[indice] !== secuencia[indice]) {
      mostrarError(indice);
      return;
    }

    puntaje += 100;
    actualizarPuntaje();

    if (secuenciaJugador.length === secuencia.length) {
      setTimeout(siguienteNivel, 1000);
    }
  }

  function mostrarError(posicionError) {
    const secuenciaHTML = secuencia.map((c, i) =>
      i === posicionError ? `<span class="resaltado">${c}</span>` : c
    ).join(', ');

    const respuestaHTML = secuenciaJugador.map((c, i) =>
      i === posicionError ? `<span class="resaltado">${c}</span>` : c
    ).join(', ');

    mensaje.innerHTML = `
      <h2>¡Te equivocaste!</h2>
      <ul>
        <li><strong>Secuencia correcta:</strong> ${secuenciaHTML}</li>
        <li><strong>Tu respuesta:</strong> ${respuestaHTML}</li>
        <li><strong>Error en la posición:</strong> ${posicionError + 1}</li>
        <li><strong>Tu puntuación:</strong> ${puntaje}</li>
      </ul>
    `;
    botonReiniciar.style.display = 'inline-block';
  }

  function reiniciarJuego() {
    secuencia = [];
    secuenciaJugador = [];
    nivel = 0;
    puntaje = 0;
    actualizarPuntaje();
    mensaje.innerHTML = '';
    botonReiniciar.style.display = 'none';
  }

  function actualizarPuntaje() {
    textoPuntaje.textContent = `Puntuación: ${puntaje}`;
  }

  // Eventos de los botones
  for (const color of colores) {
    botones[color].addEventListener('click', () => manejarClic(color));
  }

  botonIniciar.addEventListener('click', () => {
    reiniciarJuego();
    siguienteNivel();
  });

  botonReiniciar.addEventListener('click', () => {
    reiniciarJuego();
    siguienteNivel();
  });
});