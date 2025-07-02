document.addEventListener('DOMContentLoaded', () => {
  //Array con los que vamos a usar en el formulario
  const roles   = ['user', 'guest', 'admin'];
  const colores = ['rojo', 'azul', 'amarillo'];
  const numeros = [10, 20, 30];

  // FFormulario de cada elemento
  const formAdmin  = document.getElementById('form-admin');
  const formVerde  = document.getElementById('form-verde');
  const formNumero = document.getElementById('form-numero'); 
  const numInput   = document.getElementById('numInput');

  //Lugar donde se muestran los mensajes
  const msgAdmin  = document.getElementById('msg-admin');
  const msgVerde  = document.getElementById('msg-verde');
  const msgNumero = document.getElementById('msg-numero');

  // Verifica si admin esta en el array
  formAdmin.addEventListener('submit', e => {
    e.preventDefault();
    msgAdmin.textContent = roles.includes('admin')
      ? '"admin" está en el array.' // Si esta en el array
      : '"admin" NO se encuentra.'; // Si no esta en el array
  });

  // Verifica si verde esta en el array
  formVerde.addEventListener('submit', e => {
    e.preventDefault();
    msgVerde.textContent = colores.includes('verde')
      ? '"verde" está en el array de colores.' // Si esta en el array 
      : '"verde" NO está en el array de colores.'; // Si no esta en el array
  });

  // Agrega un número al array si no esta en el mismo
  formNumero.addEventListener('submit', e => {
    e.preventDefault();

    const numero = parseInt(numInput.value); // Convertimos el valor ingresado a número

    if (isNaN(numero)) {
      msgNumero.textContent = 'Por favor ingresá un número válido.'; // Verificamos si es un número
      return;
    }

    if (numeros.includes(numero)) {
      msgNumero.textContent = `El número ${numero} ya está en el array.`; // Si ya esta en el array, no lo agrega
    } else {
      numeros.push(numero); // Si no esta, lo agre
      msgNumero.textContent = `Número ${numero} agregado. Array: [${numeros.join(', ')}]`;
    }

    numInput.value = ''; //Borra la informacion dentro del input
  });
});
