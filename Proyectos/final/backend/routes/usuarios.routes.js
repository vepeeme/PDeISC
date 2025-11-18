// src/routes/usuarios.routes.js
import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware, requireRole, checkOwnership } from '../middleware/auth.js';
import { validate, actualizarUsuarioSchema } from '../middleware/validation.js';
import { PUESTOS_DISPONIBLES, PUESTOS_AREAS } from '../constants/puestos.js';


const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// LISTAR USUARIOS (solo admin)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const { rol, estado_cuenta, area_id, search } = req.query;

    let query = `
      SELECT 
        u.id, u.usuario, u.email, u.nombre_completo, u.telefono, 
        u.rol, u.foto_perfil, u.provider, u.estado_cuenta, u.creado_en,
        t.area_id, t.puesto, t.nivel_capacitacion, t.fecha_ingreso,
        a.nombre as area_nombre
      FROM usuarios u
      LEFT JOIN trabajadores t ON u.id = t.usuario_id
      LEFT JOIN areas a ON t.area_id = a.id
      WHERE u.activo = true
    `;

    const params = [];
    let paramIndex = 1;

    if (rol) {
      query += ` AND u.rol = $${paramIndex}`;
      params.push(rol);
      paramIndex++;
    }

    if (estado_cuenta) {
      query += ` AND u.estado_cuenta = $${paramIndex}`;
      params.push(estado_cuenta);
      paramIndex++;
    }

    if (area_id) {
      query += ` AND t.area_id = $${paramIndex}`;
      params.push(area_id);
      paramIndex++;
    }

    // Búsqueda por nombre/usuario/email
    if (search) {
      query += ` AND (u.nombre_completo ILIKE $${paramIndex} OR u.usuario ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY u.rol, u.nombre_completo';

    const result = await pool.query(query, params);

    res.json({
      exito: true,
      total: result.rowCount,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener usuarios'
    });
  }
});

//OBTENER USUARIO POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar permisos: admin o el mismo usuario
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permisos para ver este usuario'
      });
    }

    const result = await pool.query(`
      SELECT 
        u.*, 
        t.area_id, t.puesto, t.nivel_capacitacion, t.fecha_ingreso,
        a.nombre as area_nombre
      FROM usuarios u
      LEFT JOIN trabajadores t ON u.id = t.usuario_id
      LEFT JOIN areas a ON t.area_id = a.id
      WHERE u.id = $1 AND u.activo = true
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Remover password de la respuesta
    const { password, ...usuario } = result.rows[0];

    res.json({
      exito: true,
      usuario
    });
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener usuario'
    });
  }
});
//ACTUALIZAR PERFIL
router.put('/:id', validate(actualizarUsuarioSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, telefono, foto_perfil } = req.body;

    console.log('🔥 Request body:', { nombre_completo, telefono, foto_perfil });

    // Verificar permisos: admin o el mismo usuario
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'Sin permisos para actualizar este usuario'
      });
    }

    // Solo actualizar campos que vienen en el body
    const fieldsToUpdate = {};
    
    if (nombre_completo !== undefined) fieldsToUpdate.nombre_completo = nombre_completo || null;
    if (telefono !== undefined) fieldsToUpdate.telefono = telefono || null;
    if (foto_perfil !== undefined) fieldsToUpdate.foto_perfil = foto_perfil || null;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No hay campos para actualizar'
      });
    }

    // Construir query dinámico
    const updates = Object.keys(fieldsToUpdate).map((key, idx) => `${key} = $${idx + 1}`);
    const values = Object.values(fieldsToUpdate);
    values.push(id); // WHERE id = $N

    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${values.length}`;
    
    console.log('📝 Query:', query);
    console.log('📝 Values:', values);

    await pool.query(query, values);

    // Obtener usuario actualizado
    const result = await pool.query(
      'SELECT id, usuario, email, nombre_completo, telefono, foto_perfil, rol FROM usuarios WHERE id = $1',
      [id]
    );

    console.log('✅ Usuario actualizado:', id);

    res.json({
      exito: true,
      mensaje: 'Usuario actualizado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

// CAMBIAR ROL DE USUARIO (solo admin)
router.put('/:id/rol', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['admin', 'encargado', 'trabajador'].includes(rol)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Rol inválido. Debe ser: admin, encargado o trabajador'
      });
    }

    await pool.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2',
      [rol, id]
    );

    res.json({
      exito: true,
      mensaje: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar rol'
    });
  }
});
//  CAMBIAR ESTADO DE CUENTA (solo admin)
router.put('/:id/estado', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_cuenta } = req.body;

    if (!['activo', 'suspendido', 'pendiente', 'rechazado'].includes(estado_cuenta)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Estado inválido'
      });
    }

    await pool.query(
      'UPDATE usuarios SET estado_cuenta = $1 WHERE id = $2',
      [estado_cuenta, id]
    );

    res.json({
      exito: true,
      mensaje: 'Estado de cuenta actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar estado'
    });
  }
});
//ELIMINAR USUARIO (solo admin)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar al mismo admin
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No puedes eliminar tu propia cuenta'
      });
    }

    await pool.query(
      'UPDATE usuarios SET activo = false WHERE id = $1',
      [id]
    );

    res.json({
      exito: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar usuario'
    });
  }
});
//  OBTENER TRABAJADORES DE UN ÁREA
router.get('/area/:area_id/trabajadores', async (req, res) => {
  try {
    const { area_id } = req.params;

    const result = await pool.query(`
      SELECT 
        u.id, u.usuario, u.email, u.nombre_completo, u.foto_perfil,
        t.puesto, t.nivel_capacitacion, t.fecha_ingreso
      FROM trabajadores t
      INNER JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.area_id = $1 AND t.activo = true AND u.activo = true
      ORDER BY u.nombre_completo
    `, [area_id]);

    res.json({
      exito: true,
      total: result.rowCount,
      trabajadores: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener trabajadores:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener trabajadores del área'
    });
  }
});

//  OBTENER PUESTOS DISPONIBLES
router.get('/puestos/disponibles', (req, res) => {
  res.json({
    exito: true,
    puestos: PUESTOS_DISPONIBLES
  });
});

//  OBTENER PUESTOS POR ÁREA
router.get('/puestos/area/:areaId', (req, res) => {
  const { areaId } = req.params;
  const puestos = PUESTOS_AREAS[parseInt(areaId)] || [];
  
  res.json({
    exito: true,
    puestos
  });
});

export default router;