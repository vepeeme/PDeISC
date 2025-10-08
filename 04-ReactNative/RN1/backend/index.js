import express from 'express';
import bcrypt from 'bcrypt';
import { conexion, conectarBD } from './public/connectbbdd.js';

const app = express();
const PUERTO = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Ruta de registro
app.post('/auth/registro', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'Usuario y contraseña son obligatorios' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const [usuarioExistente] = await conexion.execute(
      'SELECT id FROM usuarios WHERE usuario = ?', 
      [usuario]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'El usuario ya está registrado' 
      });
    }

    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO usuarios (usuario, password) VALUES (?,?)`;
    const valores = [usuario, passwordEncriptada];

    const [resultado] = await conexion.execute(sql, valores);

    res.status(201).json({ 
      exito: true, 
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: resultado.insertId,
        usuario: usuario
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al registrar usuario' 
    });
  }
});
app.post('/auth/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'Usuario y contraseña son obligatorios' 
      });
    }

    const [filas] = await conexion.execute(
      'SELECT * FROM usuarios WHERE usuario = ?', 
      [usuario]
    );

    if (filas.length === 0) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    const usuarioEncontrado = filas[0];

    const passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!passwordCorrecta) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    res.json({ 
      exito: true, 
      mensaje: 'Login exitoso',
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        creado_en: usuarioEncontrado.creado_en
      }
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al iniciar sesión' 
    });
  }
});
app.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await conexion.execute('SELECT id, usuario, creado_en FROM usuarios ORDER BY id DESC');
    res.json(filas);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await conexion.execute('SELECT id, usuario, creado_en FROM usuarios WHERE id = ?', [id]);
    
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(filas[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
});
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await conexion.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

(async () => {
  try {
    await conectarBD();
    app.listen(PUERTO, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en:`);
      console.log(`   - Local: http://localhost:${PUERTO}`);
      console.log(`   - Red:   http://192.168.1.55:${PUERTO}`);
      console.log(`\n📱 Prueba desde tu celular: http://192.168.1.55:${PUERTO}/usuarios`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor:', err);
    process.exit(1);
  }
})();