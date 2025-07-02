// main.js
const express = require('express');
const path = require('path');
const app = express();

let personas = []; // lista en memoria

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// agarra el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// recibe nueva persona y responde JSON
app.post('/enviar', (req, res) => {
  const { nombre, apellido, email, pais } = req.body;
  const persona = { nombre, apellido, email, pais };
  personas.push(persona);
  res.json(persona);
});

// (Opcional) ver todas las personas
app.get('/personas', (req, res) => {
  res.json(personas);
});

const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));