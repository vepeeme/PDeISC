//Agrega un evento al enviar el formulario
document.getElementById('formMensaje').addEventListener('submit', function(e) {
    e.preventDefault();
    //toma el valor que se envia del campo
    const mensaje = document.getElementById('mensaje').value;
  
    // Reemplaza cada grupo entre paréntesis invirtiendo su contenido
    const decodificado = mensaje.replace(/\(([^()]+)\)/g, (match, contenido) => {
      return contenido.split('').reverse().join('');
    });
  
    // Muestra el resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = decodificado;
    resultadoDiv.style.display = 'block';
  });
  