//importa las funciones de calculo.js
import { sumar, restar, dividir, multiplicar } from './calculo.js';
// server.mjs
import { createServer } from 'node:http';
//le das los valores a las funciones importadas
var sum = sumar(4,5);
var hola = restar(3,6);
var mul = multiplicar(2,7);
var div = dividir(20,4);
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tabla de Operaciones</title>
    <style>
        table {
            border-collapse: collapse;
            margin: 20px;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #444;
            padding: 10px 20px;
            text-align: center;
        }
        th {
            background-color: #eee;
        }
    </style>
</head>
<body>
    <h2>Operaciones Básicas</h2>
    <table>
        <thead>
            <tr>
                <th>Operación</th>
                <th>Resultado</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>4 + 5</td>
                <td>${sum}</td>
            </tr>
            <tr>
                <td>3 - 6</td>
                <td>${hola}</td>
            </tr>
            <tr>
                <td>2 * 7</td>
                <td>${mul}</td>
            </tr>
            <tr>
                <td>20 / 4</td>
                <td>${div}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`);
});

// starts a simple http server locally on port 3000
server.listen(8083, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:8083');
});

// run with `node server.mjs`