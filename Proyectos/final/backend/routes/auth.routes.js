// backend/src/routes/auth.routes.js - ✅ POSTGRESQL
import express from 'express';
import { pool } from '../config/database.js';
import { authService } from '../services/auth.service.js';
import { 
  validate, 
  registroTrabajadorSchema, 
  registroEncargadoSchema, 
  loginSchema,
  googleCompletarSchema 
} from '../middleware/validation.js';

const router = express.Router();

// 📝 REGISTRO TRABAJADOR (directo)
router.post('/registro/trabajador', validate(registroTrabajadorSchema), async (req, res) => {
  try {
    const { usuario, password, email, nombre_completo, telefono, area_id, puesto } = req.body;

    // Verificar si ya existe
    if (await authService.userExists(usuario, email)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario o email ya está registrado'
      });
    }

    // Crear trabajador
    const nuevoUsuario = await authService.createTrabajador({
      usuario,
      password,
      email,
      nombre_completo,
      telefono,
      area_id,
      puesto
    });

    // Generar tokens
    const tokens = authService.generateTokens(nuevoUsuario);

    res.status(201).json({
      exito: true,
      mensaje: 'Trabajador registrado exitosamente',
      ...tokens,
      usuario: authService.formatUserData(nuevoUsuario)
    });
  } catch (error) {
    console.error('❌ Error al registrar trabajador:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar trabajador',
      error: error.message
    });
  }
});

// 📝 REGISTRO ENCARGADO
router.post('/registro/encargado', validate(registroEncargadoSchema), async (req, res) => {
  try {
    const { usuario, password, email, nombre_completo, telefono, area_id, motivo } = req.body;

    // Verificar si ya existe
    if (await authService.userExists(usuario, email)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario o email ya está registrado'
      });
    }

    // Crear solicitud de encargado
    const nuevoUsuario = await authService.createSolicitudEncargado({
      usuario,
      password,
      email,
      nombre_completo,
      telefono,
      area_id,
      motivo
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Solicitud enviada. Espera la aprobación del administrador.',
      usuario: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        estado_cuenta: nuevoUsuario.estado_cuenta
      }
    });
  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear solicitud de encargado',
      error: error.message
    });
  }
});

// 🔑 LOGIN
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { usuario, password } = req.body;

    console.log('🔥 Intento de login:', usuario);

    // Buscar usuario
    const usuarioEncontrado = await authService.findUserByCredentials(usuario);

    if (!usuarioEncontrado) {
      console.log('❌ Usuario no encontrado:', usuario);
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Verificar que sea login local
    if (usuarioEncontrado.provider !== 'local') {
      return res.status(401).json({
        exito: false,
        mensaje: `Esta cuenta usa autenticación con ${usuarioEncontrado.provider}`
      });
    }

    // Verificar contraseña
    const passwordValida = await authService.comparePassword(password, usuarioEncontrado.password);

    if (!passwordValida) {
      console.log('❌ Contraseña incorrecta para:', usuario);
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Validar estado de cuenta
    const estadoValidacion = authService.validateAccountStatus(usuarioEncontrado);
    if (!estadoValidacion.valid) {
      console.log('❌ Estado de cuenta inválido:', usuarioEncontrado.estado_cuenta);
      return res.status(403).json({
        exito: false,
        mensaje: estadoValidacion.message
      });
    }

    // GENERAR TOKENS JWT
    const tokens = authService.generateTokens(usuarioEncontrado);

    console.log('✅ Login exitoso:', usuarioEncontrado.usuario, '-', usuarioEncontrado.rol);

    // DEVOLVER TOKENS + USUARIO
    res.json({
      exito: true,
      mensaje: 'Login exitoso',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      usuario: authService.formatUserData(usuarioEncontrado)
    });
  } catch (error) {
    console.error('❌ Error al hacer login:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al iniciar sesión'
    });
  }
});

// 🔄 REFRESH TOKEN
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Refresh token requerido'
      });
    }

    const payload = authService.verifyToken(refreshToken, true);
    const usuario = await authService.findUserById(payload.id);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Generar nuevo access token
    const accessToken = authService.generateTokens(usuario).accessToken;

    res.json({
      exito: true,
      accessToken
    });
  } catch (error) {
    console.error('❌ Error al refrescar token:', error);
    res.status(401).json({
      exito: false,
      mensaje: 'Token inválido o expirado'
    });
  }
});

// 🌐 AUTENTICACIÓN GOOGLE (paso 1: verificar si existe)
router.post('/google/verify', async (req, res) => {
  try {
    const { email, nombre, foto } = req.body;

    if (!email || !nombre) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Email y nombre son obligatorios'
      });
    }

    // Buscar si el usuario ya existe con Google
    const usuarioExistente = await authService.findUserByEmailAndProvider(email, 'google');

    if (usuarioExistente) {
      // Usuario existe - validar estado
      const estadoValidacion = authService.validateAccountStatus(usuarioExistente);
      
      if (!estadoValidacion.valid) {
        return res.status(403).json({
          exito: false,
          mensaje: estadoValidacion.message,
          necesita_completar: false
        });
      }

      // Generar tokens
      const tokens = authService.generateTokens(usuarioExistente);

      return res.json({
        exito: true,
        mensaje: 'Login exitoso con Google',
        necesita_completar: false,
        ...tokens,
        usuario: authService.formatUserData(usuarioExistente)
      });
    }

    // Usuario no existe - debe completar datos
    res.json({
      exito: true,
      mensaje: 'Usuario nuevo, completa tu registro',
      necesita_completar: true,
      datos_google: { email, nombre, foto }
    });
  } catch (error) {
    console.error('❌ Error en verificación Google:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en autenticación con Google'
    });
  }
});

// 🌐 COMPLETAR REGISTRO GOOGLE (paso 2)
router.post('/google/completar', validate(googleCompletarSchema), async (req, res) => {
  try {
    const { email, nombre, foto, rol, area_id, puesto, motivo } = req.body;

    // Verificar que no exista ya
    const usuarioExistente = await authService.findUserByEmailAndProvider(email, 'google');
    if (usuarioExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Este usuario ya está registrado'
      });
    }

    // Crear usuario desde Google
    const nuevoUsuario = await authService.createUserFromGoogle({
      email,
      nombre,
      foto,
      rol,
      area_id,
      puesto,
      motivo
    });

    // Si es trabajador, devolver tokens
    if (rol === 'trabajador') {
      const tokens = authService.generateTokens(nuevoUsuario);
      
      return res.status(201).json({
        exito: true,
        mensaje: 'Registro completado exitosamente',
        ...tokens,
        usuario: authService.formatUserData(nuevoUsuario)
      });
    }

    // Si es encargado, solicitud pendiente
    res.status(201).json({
      exito: true,
      mensaje: 'Solicitud de encargado enviada. Espera la aprobación del administrador.',
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        estado_cuenta: nuevoUsuario.estado_cuenta
      }
    });
  } catch (error) {
    console.error('❌ Error al completar registro Google:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al completar registro',
      error: error.message
    });
  }
});

export default router;