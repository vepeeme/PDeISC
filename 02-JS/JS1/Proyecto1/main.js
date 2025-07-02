const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let registros = [];
let numeros = [];

app.post('/guardar', (req, res) => {
  const { frutas, amigos, numero } = req.body;

  if (
    !Array.isArray(frutas) ||
    frutas.length !== 3 ||
    !Array.isArray(amigos) ||
    amigos.length !== 3 ||
    typeof numero !== 'number'
  ) {
    return res.status(400).json({ error: 'Datos inválidos. Deben enviarse 3 frutas, 3 amigos y un número.' });
  }

  if (numeros.length === 0 || numero > numeros[numeros.length - 1]) {
    numeros.push(numero);
  }

  registros.push({
    frutas: [...frutas],
    amigos: [...amigos],
    numeros: [...numeros]
  });

  res.json({ ok: true });
});

app.get('/mostrar', (req, res) => {
  res.json(registros);
});

const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
