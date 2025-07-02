// Espera a que todo el contenido HTML se haya cargado completamente
document.addEventListener("DOMContentLoaded", () => {

  // colores usados
  const colores = ['verde', 'rojo', 'amarillo', 'azul'];

  // secuencia que el juego va generando
  let secuencia = [];

  // secuencia que el jugador va ingresando
  let secuenciaJugador = [];

  // nivel actual
  let nivel = 0;

  // puntaje del jugador
  let puntaje = 0;

  // referencias a los botones de colores en el DOM
  const botones = {
    verde: document.getElementById('verde'),
    rojo: document.getElementById('rojo'),
    amarillo: document.getElementById('amarillo'),
    azul: document.getElementById('azul')
  };

  // referencias a elementos del DOM
  const botonIniciar = document.getElementById('iniciar');
  const mensaje = document.getElementById('mensaje');
  const textoPuntaje = document.getElementById('puntaje');

  // resalta brevemente un color
  function resaltar(color) {
    const boton = botones[color];
    boton.classList.add('activo'); 
    setTimeout(() => boton.classList.remove('activo'), 500); 
  }

  // agrega un nuevo color aleatorio cuando pasa el nivel
  function siguienteNivel() {
    secuenciaJugador = [];
    nivel++; 
    
    // agrega un color aleatorio a la secuencia
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    secuencia.push(colorAleatorio);

    // muestra la secuencia del jugador
    mostrarSecuencia();
  }

  // muestra la secuencia de colores uno por uno con retraso entre cada uno
  function mostrarSecuencia() {
    let i = 0;
    const intervalo = setInterval(() => {
      resaltar(secuencia[i]);
      i++;
      if (i >= secuencia.length) clearInterval(intervalo);
    }, 700); 
  }

  // en base al clic del jugador sobre un color lo reslta y agrega al array
  function manejarClic(color) {
    secuenciaJugador.push(color);
    resaltar(color); 

    const indice = secuenciaJugador.length - 1;

    // verifica si el clic es incorrecto comparado con la secuencia
    if (secuenciaJugador[indice] !== secuencia[indice]) {
      mostrarError(indice); 
      return;
    }

    // si el clic fue correcto, suma puntos
    puntaje += 100;
    actualizarPuntaje();

    // pasa al siguiente nivel si lo hizo bien
    if (secuenciaJugador.length === secuencia.length) {
      setTimeout(siguienteNivel, 1000); 
    }
  }

  // mensaje de error cuando el jugador se equivoca
  function mostrarError(posicionError) {
    // muestra la secuencia correcta, resaltando el error
    const secuenciaHTML = secuencia.map((c, i) =>
      i === posicionError ? `<span class="resaltado">${c}</span>` : c
    ).join(', ');

    // muestra la respuesta del jugador, resaltando el error
    const respuestaHTML = secuenciaJugador.map((c, i) =>
      i === posicionError ? `<span class="resaltado">${c}</span>` : c
    ).join(', ');

    // muestra el mensaje de error en pantalla
    mensaje.innerHTML = `
      <h2>¡Te equivocaste!</h2>
      <ul>
        <li><strong>Secuencia correcta:</strong> ${secuenciaHTML}</li>
        <li><strong>Tu respuesta:</strong> ${respuestaHTML}</li>
        <li><strong>Error en la posición:</strong> ${posicionError + 1}</li>
        <li><strong>Tu puntuación:</strong> ${puntaje}</li>
      </ul>
    `;

    // cambia el boton para que diga "Jugar de nuevo" y lo muestra
    botonIniciar.textContent = 'Jugar de nuevo';
    botonIniciar.style.display = 'inline-block';
  }

  // reinicia todas las variables y el estado del juego
  function reiniciarJuego() {
    secuencia = [];
    secuenciaJugador = [];
    nivel = 0;
    puntaje = 0;
    actualizarPuntaje();
    mensaje.innerHTML = ''; 
    botonIniciar.style.display = 'none';
    botonIniciar.textContent = 'Comenzar'; 
  }

  // actualiza el puntaje en pantalla
  function actualizarPuntaje() {
    textoPuntaje.textContent = `Puntuación: ${puntaje}`;
  }

  // agrega eventos a cada botón de color
  for (const color of colores) {
    botones[color].addEventListener('click', () => manejarClic(color));
  }

  // inicia o reinicia el juego cuando se pulsa el boton
  botonIniciar.addEventListener('click', () => {
    reiniciarJuego();     
    siguienteNivel();     
  });

});
