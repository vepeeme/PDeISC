import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta get usando fetch en el servidor
app.get('/api/users-fetch', async (_req, res) => {
  try {
    const resp  = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await resp.json();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta get usando axios en el servidor
app.get('/api/users-axios', async (_req, res) => {
  try {
    const resp = await axios.get('https://jsonplaceholder.typicode.com/users');
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

const PUERTO = 3000;
app.listen(PUERTO, () =>
  console.log(`Proyecto 1 corriendo en http://localhost:${PUERTO}`)
);
