document.addEventListener('DOMContentLoaded', () => {
  // Arrays con los que vamos a usar en los formularios
  const nombres = ['Juan', 'María', 'Pedro'];
  const numeros = [5, 10, 15];
  const personas = [
    { nombre: 'Lucía', edad: 25 },
    { nombre: 'Carlos', edad: 30 },
    { nombre: 'Ana', edad: 22 }
  ];

  // Son los formularios de cada elemento
  const formNombres  = document.getElementById('form-nombres');
  const formNumeros  = document.getElementById('form-numeros');
  const formPersonas = document.getElementById('form-personas');

  // Son las listas del HTML
  const listaNombres  = document.getElementById('lista-nombres');
  const listaNumeros  = document.getElementById('lista-numeros');
  const listaPersonas = document.getElementById('lista-personas');

  // Muestra cada elemento del array de nombres con un saludo
  formNombres.addEventListener('submit', e => {
    e.preventDefault();
    listaNombres.innerHTML = ''; //Borra la lista anterior
    nombres.forEach(nombre => {
      const li = document.createElement('li'); 
      li.textContent = `Hola ${nombre}`; //agrega un hola con el nombre
      listaNombres.appendChild(li);
    });
  });

  // Muestra el doble del numero de cada elemento del array
  formNumeros.addEventListener('submit', e => {
    e.preventDefault();
    listaNumeros.innerHTML = ''; // Borra la lista anterior
    numeros.forEach(num => {
      const li = document.createElement('li');
      li.textContent = `El doble de ${num} es ${num * 2}`; //agrega el doble multimplicando al elemento por 2
      listaNumeros.appendChild(li);
    });
  });

  // Muestra el nombre y la edad de cada elemento del array de objetos
  formPersonas.addEventListener('submit', e => {
    e.preventDefault();
    listaPersonas.innerHTML = ''; // Borra la lista anterior
    personas.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.nombre} tiene ${p.edad} años`; //agrega el nombre y la edad del elemento
      listaPersonas.appendChild(li);
    });
  });
});
