// Agrega un evento al enviar el furmulario de ordenar números 
document.getElementById('formOrdenarNumeros').addEventListener('submit', function (event) {
  event.preventDefault();

  // Convierte la cadena en un array de números
  const numerosArray = document.getElementById('numerosArray').value.split(',').map(Number);

  // Ordena de menor a mayor
  const numerosOrdenados = numerosArray.sort((a, b) => a - b);

  // Muestra el resultado 
  document.getElementById('numerosResultado').textContent = numerosOrdenados.join(', ');
});


// Agrega un evento al enviar el formulario de ordenar palabras
document.getElementById('formOrdenarPalabras').addEventListener('submit', function (event) {
  event.preventDefault();

  // Crea un array de palabras
  const palabrasArray = document.getElementById('palabrasArray').value.split(',');

  // Ordena alfabéticamente
  const palabrasOrdenadas = palabrasArray.sort();

  // Muestra el resultado 
  document.getElementById('palabrasResultado').textContent = palabrasOrdenadas.join(', ');
});


// Agrega un evento al enviar el formulario de ordenar las personas
document.getElementById('formOrdenarObjetos').addEventListener('submit', function (event) {
  event.preventDefault(); // Detiene comportamiento por defecto

  // Convierte la cadena enviada del input en un array de objetos con nombre y edad
  const objetosArray = document.getElementById('objetosArray').value.split(';').map(objeto => {
    const [nombre, edad] = objeto.split(','); // Separa nombre y edad
    return { nombre, edad: Number(edad) };    // Devuelve el objeto con edad como número
  });

  // Ordena los objetos por edad de menor a mayor
  const objetosOrdenados = objetosArray.sort((a, b) => a.edad - b.edad);

  // Muestra los resultados
  const resultado = objetosOrdenados.map(obj => `${obj.nombre} (${obj.edad} años)`).join(', ');
  document.getElementById('objetosResultado').textContent = resultado;
});
