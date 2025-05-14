// Agrega un evento al enviar el formulario de numeros
document.getElementById('formNumeros').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtiene el valor del input y lo convierte en array de números
  const input = document.getElementById('numeros').value;
  const array = input.split(',').map(n => parseFloat(n)); // Convierte a float

  // Multimplica cada elemento del array por 3
  const resultado = array.map(n => n * 3);

  // Muestra los resultados en una lista
  const ul = document.getElementById('resultadoNumeros');
  ul.innerHTML = ''; // Borra lista anterior

  resultado.forEach(r => {
    const li = document.createElement('li'); // Crea un <li> por cada resultado
    li.textContent = r; // Asigna el texto
    ul.appendChild(li); // Agrega a la lista
  });

  this.reset(); // Borra el formulario
});

// Agrega un evento al enviar el formulario de nombres
document.getElementById('formNombres').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtiene el valor del input y lo divide en array de nombres
  const input = document.getElementById('nombres').value;
  const array = input.split(',');

  // Convierte cada nombre a mayúsculas
  const resultado = array.map(nombre => nombre.toUpperCase());

  // Muestra los resultados en una lista
  const ul = document.getElementById('resultadoNombres');
  ul.innerHTML = '';

  resultado.forEach(n => {
    const li = document.createElement('li');
    li.textContent = n;
    ul.appendChild(li);
  });

  this.reset();
});

// Agrega un evento al enviar el formulario de precios
document.getElementById('formPrecios').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtiene los precios y los convierte en array de floats
  const input = document.getElementById('precios').value;
  const array = input.split(',').map(p => parseFloat(p));

  // Aplica el IVA del 21% y redondea a 2 decimales
  const resultado = array.map(p => (p * 1.21).toFixed(2));

  // Muestra los resultados
  const ul = document.getElementById('resultadoPrecios');
  ul.innerHTML = '';

  resultado.forEach(p => {
    const li = document.createElement('li'); // crea un elemento a la lista
    li.textContent = `$${p}`; // le agrega el valor del precio
    ul.appendChild(li);
  });

  this.reset();
});
