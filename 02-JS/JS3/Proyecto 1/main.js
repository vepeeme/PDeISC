const express = require('express');
const path = require('path');
const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PUERTO, () => console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`));