// backend/src/routes/auth.routes.js - SIN GOOGLE
import express from 'express';
import { pool } from '../config/database.js';
import { authService } from '../services/auth.service.js';
import { 
  validate, 
  registroTrabajadorSchema, 
  registroEncargadoSchema, 
  loginSchema
} from '../middleware/validation.js';

const router = express.Router();

// 📝 REGISTRO TRABAJADOR (directo)
router.post('/registro/trabajador', validate(registroTrabajadorSchema), async (req, res) => {
  try {
    const { usuario, password, email, nombre_completo, telefono, area_id, puesto } = req.body;

    if (await authService.userExists(usuario, email)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario o email ya está registrado'
      });
    }

    const nuevoUsuario = await authService.createTrabajador({
      usuario,
      password,
      email,
      nombre_completo,
      telefono,
      area_id,
      puesto
    });

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

    if (await authService.userExists(usuario, email)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario o email ya está registrado'
      });
    }

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

    const usuarioEncontrado = await authService.findUserByCredentials(usuario);

    if (!usuarioEncontrado) {
      console.log('❌ Usuario no encontrado:', usuario);
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    if (usuarioEncontrado.provider !== 'local') {
      return res.status(401).json({
        exito: false,
        mensaje: `Esta cuenta usa autenticación con ${usuarioEncontrado.provider}`
      });
    }

    const passwordValida = await authService.comparePassword(password, usuarioEncontrado.password);

    if (!passwordValida) {
      console.log('❌ Contraseña incorrecta para:', usuario);
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    const estadoValidacion = authService.validateAccountStatus(usuarioEncontrado);
    if (!estadoValidacion.valid) {
      console.log('❌ Estado de cuenta inválido:', usuarioEncontrado.estado_cuenta);
      return res.status(403).json({
        exito: false,
        mensaje: estadoValidacion.message
      });
    }

    const tokens = authService.generateTokens(usuarioEncontrado);

    console.log('✅ Login exitoso:', usuarioEncontrado.usuario, '-', usuarioEncontrado.rol);

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

export default router;