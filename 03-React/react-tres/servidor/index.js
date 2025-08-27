import express from 'express';
import { conexion, conectarBD } from './public/connectbbdd.js';

const app = express();
const PUERTO = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await conexion.execute('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(filas);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await conexion.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (filas.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(filas[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;
    const sql = `INSERT INTO usuarios (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email) VALUES (?,?,?,?,?,?,?)`;
    const valores = [nombre || null, apellido || null, direccion || null, telefono || null, celular || null, fecha_nacimiento || null, email || null];
    const [resultado] = await conexion.execute(sql, valores);
    res.status(201).json({ id: resultado.insertId, ...req.body });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (error?.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El email ya existe' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;
    const sql = `UPDATE usuarios SET nombre=?, apellido=?, direccion=?, telefono=?, celular=?, fecha_nacimiento=?, email=? WHERE id=?`;
    const valores = [nombre || null, apellido || null, direccion || null, telefono || null, celular || null, fecha_nacimiento || null, email || null, id];
    const [resultado] = await conexion.execute(sql, valores);
    if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    if (error?.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El email ya existe' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await conexion.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

(async () => {
  try {
    await conectarBD();
    app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor por error en la BD:', err);
    process.exit(1);
  }
})();
