const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`Servidor corriendo en http://localhost:${PUERTO}`));
