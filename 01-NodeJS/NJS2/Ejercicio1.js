import { sumar, restar, multiplicar, dividir } from './Modulo1e1.js';
// server.mjs
import { myDateTime } from './Modulo2e1.js'
import { temperatura } from './Modulo3e1.js'
import { createServer } from 'node:http';
//le das los valores a las funciones importadas
var temp = temperatura(14);
var hora = myDateTime();
var sum = sumar(11,3);
var hola = restar(4,7);
var mul = multiplicar(13,6);
var div = dividir(80,5);
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tabla de Operaciones</title>
    <style>
    </style>
</head>
<body>
    <h2>Calculos</h2>
    <p>11 + 3 = ${sum}</p><br>
    <p>4 - 7 = ${hola}</p><br>
    <p>13 * 6 = ${mul}</p><br>
    <p>80 / 5 = ${div}</p><br>
    <h2>Hora:</h2>
    <p>${hora}</p>
    <h2>Temperatura</h2>
    <p>${temp}</p>
</body>
</html>`);
});
  


// starts a simple http server locally on port 3000
server.listen(8083, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:8083');
});

// run with `node server.mjs`