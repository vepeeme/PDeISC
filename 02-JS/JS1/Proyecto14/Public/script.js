// Agrega un evento al enviar el formulario de invertir letras
document.getElementById("formLetras").addEventListener("submit", function (e) {
  e.preventDefault();

  // Convierte el input en un array de letras
  const letras = document.getElementById("inputLetras").value.split(",");

  // Invierte el orden del array
  const invertido = letras.reverse();

  // Muestra el resultado
  document.getElementById("resultadoLetras").textContent = invertido.join(", ");
});

// Agrega un evento al enviar el formulario de invertir los numeros
document.getElementById("formNumeros").addEventListener("submit", function (e) {
  e.preventDefault(); 

  // Convierte el input en un array de números
  const numeros = document.getElementById("inputNumeros").value
    .split(",")
    .map(Number);

  // Invierte el array numérico
  const invertido = numeros.reverse();

  // Muestra el resultado
  document.getElementById("resultadoNumeros").textContent = invertido.join(", ");
});


// Agrega un evento al enviar el formulario de invertir un string
document.getElementById("formString").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtiene el texto ingresado
  const texto = document.getElementById("inputString").value;

  // Separa cada carácter, lo invierte y lo une
  const invertido = texto.split("").reverse().join("");

  // Muestra el resultado
  document.getElementById("resultadoString").textContent = invertido;
});
