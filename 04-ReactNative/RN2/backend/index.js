import express from 'express';
import bcrypt from 'bcrypt';
import { conexion, conectarBD } from './public/connectbbdd.js';

const app = express();
const PUERTO = 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 🔥 REGISTRO TRADICIONAL
app.post('/auth/registro', async (req, res) => {
  try {
    console.log('\n🔵 ===== NUEVA PETICIÓN DE REGISTRO =====');
    console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
    
    const { usuario, password, email } = req.body;

    console.log('📥 Datos extraídos:', { 
      usuario: usuario || 'undefined', 
      password: password ? '***' : 'undefined', 
      email: email || 'undefined' 
    });

    if (!usuario || !password) {
      console.log('❌ Validación fallida: campos vacíos');
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'Usuario y contraseña son obligatorios' 
      });
    }

    if (password.length < 6) {
      console.log('❌ Validación fallida: contraseña corta');
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si usuario existe
    const [usuarioExistente] = await conexion.execute(
      'SELECT id FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (usuarioExistente.length > 0) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'El usuario ya está registrado' 
      });
    }

    // Si hay email, verificar que no exista
    if (email) {
      const [emailExistente] = await conexion.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      );

      if (emailExistente.length > 0) {
        console.log('❌ Email ya existe');
        return res.status(400).json({ 
          exito: false, 
          mensaje: 'El email ya está registrado' 
        });
      }
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const [resultado] = await conexion.execute(
      'INSERT INTO usuarios (usuario, password, email, provider) VALUES (?, ?, ?, ?)',
      [usuario, passwordEncriptada, email || null, 'local']
    );

    console.log('✅ Usuario registrado exitosamente:', usuario);

    res.status(201).json({ 
      exito: true, 
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: resultado.insertId,
        usuario: usuario,
        email: email || null,
        provider: 'local'
      }
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// 🔥 LOGIN TRADICIONAL
app.post('/auth/login', async (req, res) => {
  try {
    console.log('\n🔵 ===== NUEVA PETICIÓN DE LOGIN =====');
    const { usuario, password } = req.body;
    console.log('📥 Usuario:', usuario);

    if (!usuario || !password) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'Usuario y contraseña son obligatorios' 
      });
    }

    const [filas] = await conexion.execute(
      'SELECT * FROM usuarios WHERE usuario = ? OR email = ?', 
      [usuario, usuario]
    );

    if (filas.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    const usuarioEncontrado = filas[0];

    if (usuarioEncontrado.provider !== 'local') {
      console.log('❌ Usuario usa OAuth');
      return res.status(401).json({ 
        exito: false, 
        mensaje: `Esta cuenta usa login con ${usuarioEncontrado.provider}` 
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!passwordCorrecta) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    console.log('✅ Login exitoso:', usuario);

    res.json({ 
      exito: true, 
      mensaje: 'Login exitoso',
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        nombre_completo: usuarioEncontrado.nombre_completo,
        telefono: usuarioEncontrado.telefono,
        direccion: usuarioEncontrado.direccion,
        latitud: usuarioEncontrado.latitud,
        longitud: usuarioEncontrado.longitud,
        foto_perfil: usuarioEncontrado.foto_perfil,
        foto_documento: usuarioEncontrado.foto_documento,
        provider: usuarioEncontrado.provider,
        creado_en: usuarioEncontrado.creado_en
      }
    });
  } catch (error) {
    console.error('❌ Error al hacer login:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al iniciar sesión' 
    });
  }
});

// 🔥 LOGIN/REGISTRO CON OAUTH
app.post('/auth/oauth', async (req, res) => {
  try {
    console.log('\n🔵 ===== NUEVA PETICIÓN OAUTH =====');
    const { provider, provider_id, email, nombre, foto } = req.body;
    console.log('📥 Provider:', provider, '| Email:', email);

    if (!provider || !provider_id || !email) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: 'Datos de OAuth incompletos' 
      });
    }

    const [usuarioExistente] = await conexion.execute(
      'SELECT * FROM usuarios WHERE provider_id = ? OR email = ?',
      [provider_id, email]
    );

    let usuario;

    if (usuarioExistente.length > 0) {
      usuario = usuarioExistente[0];
      
      await conexion.execute(
        'UPDATE usuarios SET nombre_completo = ?, foto_perfil = ?, provider = ?, provider_id = ? WHERE id = ?',
        [nombre || usuario.nombre_completo, foto || usuario.foto_perfil, provider, provider_id, usuario.id]
      );

      usuario.nombre_completo = nombre || usuario.nombre_completo;
      usuario.foto_perfil = foto || usuario.foto_perfil;
      
      console.log('✅ Usuario existente actualizado');
    } else {
      const usuarioGenerado = email.split('@')[0];
      
      const [resultado] = await conexion.execute(
        'INSERT INTO usuarios (usuario, email, nombre_completo, foto_perfil, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)',
        [usuarioGenerado, email, nombre, foto, provider, provider_id]
      );

      usuario = {
        id: resultado.insertId,
        usuario: usuarioGenerado,
        email: email,
        nombre_completo: nombre,
        foto_perfil: foto,
        provider: provider,
        provider_id: provider_id
      };
      
      console.log('✅ Nuevo usuario OAuth creado');
    }

    res.json({ 
      exito: true, 
      mensaje: 'Login OAuth exitoso',
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
        email: usuario.email,
        nombre_completo: usuario.nombre_completo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        latitud: usuario.latitud,
        longitud: usuario.longitud,
        foto_perfil: usuario.foto_perfil,
        foto_documento: usuario.foto_documento,
        provider: usuario.provider,
        creado_en: usuario.creado_en
      }
    });
  } catch (error) {
    console.error('❌ Error en OAuth:', error);
    res.status(500).json({ 
      exito: false, 
      mensaje: 'Error al autenticar con OAuth',
      error: error.message
    });
  }
});

// 🔥 OBTENER PERFIL
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await conexion.execute(
      'SELECT id, usuario, email, nombre_completo, telefono, direccion, latitud, longitud, foto_perfil, foto_documento, provider, creado_en FROM usuarios WHERE id = ?',
      [id]
    );
    
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(filas[0]);
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
});

// 🔥 ACTUALIZAR PERFIL
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre_completo, 
      telefono, 
      direccion, 
      latitud, 
      longitud, 
      foto_perfil, 
      foto_documento 
    } = req.body;

    const campos = [];
    const valores = [];

    if (nombre_completo !== undefined) {
      campos.push('nombre_completo = ?');
      valores.push(nombre_completo);
    }
    if (telefono !== undefined) {
      campos.push('telefono = ?');
      valores.push(telefono);
    }
    if (direccion !== undefined) {
      campos.push('direccion = ?');
      valores.push(direccion);
    }
    if (latitud !== undefined) {
      campos.push('latitud = ?');
      valores.push(latitud);
    }
    if (longitud !== undefined) {
      campos.push('longitud = ?');
      valores.push(longitud);
    }
    if (foto_perfil !== undefined) {
      campos.push('foto_perfil = ?');
      valores.push(foto_perfil);
    }
    if (foto_documento !== undefined) {
      campos.push('foto_documento = ?');
      valores.push(foto_documento);
    }

    if (campos.length === 0) {
      return res.status(400).json({ mensaje: 'No hay datos para actualizar' });
    }

    valores.push(id);

    await conexion.execute(
      `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );

    const [usuarioActualizado] = await conexion.execute(
      'SELECT id, usuario, email, nombre_completo, telefono, direccion, latitud, longitud, foto_perfil, foto_documento, provider, creado_en FROM usuarios WHERE id = ?',
      [id]
    );

    res.json({ 
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado[0]
    });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
});

// 🔥 LISTAR USUARIOS
app.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await conexion.execute(
      'SELECT id, usuario, email, nombre_completo, foto_perfil, provider, creado_en FROM usuarios ORDER BY id DESC'
    );
    res.json(filas);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// 🔥 ELIMINAR USUARIO
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await conexion.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

(async () => {
  try {
    await conectarBD();
    app.listen(PUERTO, '0.0.0.0', () => {
      console.log(`\n🚀 ============================================`);
      console.log(`   SERVIDOR CORRIENDO EXITOSAMENTE`);
      console.log(`============================================`);
      console.log(`📍 Local:  http://localhost:${PUERTO}`);
      console.log(`📍 Red:    http://192.168.1.10:${PUERTO}`);
      console.log(`\n✅ Endpoints disponibles:`);
      console.log(`   POST   /auth/registro`);
      console.log(`   POST   /auth/login`);
      console.log(`   POST   /auth/oauth`);
      console.log(`   GET    /usuarios`);
      console.log(`   GET    /usuarios/:id`);
      console.log(`   PUT    /usuarios/:id`);
      console.log(`   DELETE /usuarios/:id`);
      console.log(`============================================\n`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor:', err);
    process.exit(1);
  }
})();