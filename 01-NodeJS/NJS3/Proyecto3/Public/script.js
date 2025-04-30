function contarHijosBody() {
    const hijos = document.body.children.length;
    const resultado = document.getElementById('resultado');
    resultado.textContent = `El <body> tiene ${hijos} hijo(s) directos.`;
  }

  // Asignar evento al botón
  document.getElementById('botonContar').addEventListener('click', contarHijosBody);