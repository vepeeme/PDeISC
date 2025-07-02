
// Agrega un evento al enviar el formulario de suma
document.getElementById('formSuma').addEventListener('submit', function (event) {
  event.preventDefault();

  // Obtiene el valor del input, lo separa por comas y convierte cada elemento a número
  const sumaArray = document.getElementById('sumaArray').value.split(',').map(Number);

  // Suma todos los elementos del array
  const sumaResultado = sumaArray.reduce((acumulador, valorActual) => acumulador + valorActual, 0);

  // Muestra el resultado
  document.getElementById('sumaResultado').textContent = sumaResultado;
});

// Agrega un evento al enviar el formulario de multiplicación
document.getElementById('formMultiplicacion').addEventListener('submit', function (event) {
  event.preventDefault();

  // Convierte el input de texto en un array de números
  const multiplicacionArray = document.getElementById('multiplicacionArray').value.split(',').map(Number);

  // Multiplica todos los elementos del array
  const multiplicacionResultado = multiplicacionArray.reduce((acumulador, valorActual) => acumulador * valorActual, 1);

  // Muestra el resultado
  document.getElementById('multiplicacionResultado').textContent = multiplicacionResultado;
});


// Agrega un evento al enviar el formulario de suma de precios
document.getElementById('formTotalPrecio').addEventListener('submit', function (event) {
  event.preventDefault();

  // Convierte la lista de precios separada por comas en un array de números
  const productosArray = document.getElementById('productosArray').value.split(',').map(Number);

  // Suma todos los precios
  const totalPrecio = productosArray.reduce((acumulador, precio) => acumulador + precio, 0);

  // Muestra el total 
  document.getElementById('totalPrecioResultado').textContent = totalPrecio;
});
