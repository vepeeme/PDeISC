import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { CZooAnimal } from './CZooAnimal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const listaAnimales = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta POST para registrar un nuevo animal
app.post('/guardar-animal', (req, res) => {
  const { IdAnimal, nombre, JaulaNumero, IdTypeAnimal, peso } = req.body;

  // Crear objeto plano con estructura de CZooAnimal
  const nuevoAnimal = {
    IdAnimal: parseInt(IdAnimal),
    nombre: nombre.trim(),
    JaulaNumero: parseInt(JaulaNumero),
    IdTypeAnimal: parseInt(IdTypeAnimal),
    peso: parseFloat(peso)
  };

  if (listaAnimales.length < 5) {
    listaAnimales.push(nuevoAnimal);
    res.status(200).json({ mensaje: 'Animal guardado', cantidad: listaAnimales.length });
  } else {
    res.status(400).json({ mensaje: 'Límite de 5 animales alcanzado' });
  }
});

app.get('/animales', (req, res) => {
  res.json(listaAnimales);
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor activo en http://localhost:${PUERTO}`);
})
