// backend/src/services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_muy_segura_aqui_cambiar_en_produccion';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tu_refresh_secret_key_muy_segura_aqui_cambiar_en_produccion';

export const authService = {
  // Generar tokens JWT
  generateTokens(usuario) {
    const accessToken = jwt.sign(
      { 
        id: usuario.id, 
        rol: usuario.rol, 
        usuario: usuario.usuario 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    console.log('🔑 Tokens generados para usuario:', usuario.usuario);
    return { accessToken, refreshToken };
  },

  // Verificar token
  verifyToken(token, isRefresh = false) {
    try {
      const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  },

  // Hash de contraseña
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  },

  // Comparar contraseña
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },

  // Buscar usuario por email o username
  async findUserByCredentials(identifier) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE (usuario = $1 OR email = $1) AND activo = true',
      [identifier]
    );
    return result.rows[0] || null;
  },

  // Buscar usuario por ID
  async findUserById(id) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1 AND activo = true',
      [id]
    );
    return result.rows[0] || null;
  },

  // Verificar si usuario existe
  async userExists(usuario, email) {
    const result = await pool.query(
      'SELECT id FROM usuarios WHERE usuario = $1 OR email = $2',
      [usuario, email]
    );
    return result.rowCount > 0;
  },

  // Crear usuario trabajador
  async createTrabajador(data) {
    const { usuario, password, email, nombre_completo, telefono, area_id, puesto } = data;

    const passwordHash = await this.hashPassword(password);

    const result = await pool.query(
      `INSERT INTO usuarios (usuario, password, email, nombre_completo, telefono, rol, estado_cuenta) 
       VALUES ($1, $2, $3, $4, $5, 'trabajador', 'activo') RETURNING id`,
      [usuario, passwordHash, email, nombre_completo || null, telefono || null]
    );

    const usuarioId = result.rows[0].id;

    // Crear registro en tabla trabajadores
    if (area_id) {
      await pool.query(
        'INSERT INTO trabajadores (usuario_id, area_id, puesto, fecha_ingreso) VALUES ($1, $2, $3, CURRENT_DATE)',
        [usuarioId, area_id, puesto || 'Operario']
      );
    }

    return await this.findUserById(usuarioId);
  },

  // Crear solicitud de encargado
  async createSolicitudEncargado(data) {
    const { usuario, password, email, nombre_completo, telefono, area_id, motivo } = data;

    const passwordHash = await this.hashPassword(password);

    const result = await pool.query(
      `INSERT INTO usuarios (usuario, password, email, nombre_completo, telefono, rol, estado_cuenta) 
       VALUES ($1, $2, $3, $4, $5, 'encargado', 'pendiente') RETURNING id`,
      [usuario, passwordHash, email, nombre_completo || null, telefono || null]
    );

    const usuarioId = result.rows[0].id;

    // Crear solicitud
    await pool.query(
      'INSERT INTO solicitudes_encargado (usuario_id, area_solicitada_id, motivo) VALUES ($1, $2, $3)',
      [usuarioId, area_id || null, motivo || 'Solicitud de rol encargado']
    );

    // Notificar al admin (email - opcional)
    try {
      const area = area_id ? await this.getAreaById(area_id) : null;
      const { emailService } = await import('./email.service.js');
      await emailService.notificarNuevaSolicitud({
        id: usuarioId,
        usuario,
        email,
        nombre_completo,
        motivo
      }, area);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de notificación:', emailError);
    }

    return await this.findUserById(usuarioId);
  },

  // Buscar usuario por email y provider (Google)
  async findUserByEmailAndProvider(email, provider = 'google') {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND provider = $2',
      [email, provider]
    );
    return result.rows[0] || null;
  },

  // Crear usuario desde Google
  async createUserFromGoogle(data) {
    const { email, nombre, foto, rol, area_id, puesto, motivo } = data;

    const usuario_generado = email.split('@')[0];
    const estado = rol === 'trabajador' ? 'activo' : 'pendiente';

    const result = await pool.query(
      `INSERT INTO usuarios (usuario, email, nombre_completo, foto_perfil, rol, provider, provider_id, estado_cuenta) 
       VALUES ($1, $2, $3, $4, $5, 'google', $6, $7) RETURNING id`,
      [usuario_generado, email, nombre, foto || null, rol, email, estado]
    );

    const usuarioId = result.rows[0].id;

    if (rol === 'trabajador' && area_id) {
      await pool.query(
        'INSERT INTO trabajadores (usuario_id, area_id, puesto, fecha_ingreso) VALUES ($1, $2, $3, CURRENT_DATE)',
        [usuarioId, area_id, puesto || 'Operario']
      );
    }

    if (rol === 'encargado') {
      await pool.query(
        'INSERT INTO solicitudes_encargado (usuario_id, area_solicitada_id, motivo) VALUES ($1, $2, $3)',
        [usuarioId, area_id || null, motivo || 'Solicitud de rol encargado vía Google']
      );

      // Notificar al admin (Google)
      try {
        const area = area_id ? await this.getAreaById(area_id) : null;
        const { emailService } = await import('./email.service.js');
        await emailService.notificarNuevaSolicitud({
          id: usuarioId,
          usuario: usuario_generado,
          email,
          nombre_completo: nombre,
          motivo
        }, area);
      } catch (emailError) {
        console.error('⚠️ Error al enviar email de notificación:', emailError);
      }
    }

    return await this.findUserById(usuarioId);
  },

  // Validar estado de cuenta
  validateAccountStatus(usuario) {
    if (usuario.estado_cuenta === 'pendiente') {
      return {
        valid: false,
        message: 'Tu cuenta está pendiente de aprobación por el administrador'
      };
    }

    if (usuario.estado_cuenta === 'rechazado') {
      return {
        valid: false,
        message: 'Tu solicitud fue rechazada. Contacta al administrador.'
      };
    }

    if (usuario.estado_cuenta === 'suspendido') {
      return {
        valid: false,
        message: 'Tu cuenta ha sido suspendida'
      };
    }

    return { valid: true };
  },

  // Formatear datos de usuario (sin password)
  formatUserData(usuario) {
    const { password, ...userData } = usuario;
    return userData;
  },

  // Helper para obtener área
  async getAreaById(id) {
    const result = await pool.query('SELECT * FROM areas WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
};

export default authService;