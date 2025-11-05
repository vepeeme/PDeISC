// backend/src/routes/solicitudes.routes.js - ✅ POSTGRESQL CORREGIDO
import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { validate, aprobarSolicitudSchema, rechazarSolicitudSchema } from '../middleware/validation.js';
import { emailService } from '../services/email.service.js';

const router = express.Router();

// Todas las rutas requieren autenticación de admin
router.use(authMiddleware, requireRole('admin'));

// LISTAR SOLICITUDES PENDIENTES
router.get('/', async (req, res) => {
  try {
    const { estado } = req.query;

    let query = `
      SELECT 
        s.*,
        u.usuario, u.email, u.nombre_completo, u.telefono, u.foto_perfil,
        a.nombre as area_solicitada_nombre,
        rev.nombre_completo as revisado_por_nombre
      FROM solicitudes_encargado s
      INNER JOIN usuarios u ON s.usuario_id = u.id
      LEFT JOIN areas a ON s.area_solicitada_id = a.id
      LEFT JOIN usuarios rev ON s.revisado_por = rev.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (estado) {
      query += ` AND s.estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    query += ' ORDER BY s.creado_en DESC';

    const result = await pool.query(query, params);

    res.json({
      exito: true,
      total: result.rowCount,
      solicitudes: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener solicitudes'
    });
  }
});

// APROBAR SOLICITUD
router.put('/:id/aprobar', validate(aprobarSolicitudSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { area_id, comentario } = req.body;

    // Iniciar transacción
    await pool.query('BEGIN');

    // Obtener solicitud
    const solicitudResult = await pool.query(
      'SELECT * FROM solicitudes_encargado WHERE id = $1',
      [id]
    );

    if (solicitudResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        exito: false,
        mensaje: 'Solicitud no encontrada'
      });
    }

    const solicitud = solicitudResult.rows[0];

    if (solicitud.estado !== 'pendiente') {
      await pool.query('ROLLBACK');
      return res.status(400).json({
        exito: false,
        mensaje: `Esta solicitud ya fue ${solicitud.estado}`
      });
    }

    // Actualizar estado del usuario a 'activo'
    await pool.query(
      'UPDATE usuarios SET estado_cuenta = $1 WHERE id = $2',
      ['activo', solicitud.usuario_id]
    );

    // Si se especifica área, asignar como responsable
    const areaFinal = area_id || solicitud.area_solicitada_id;
    
    if (areaFinal) {
      await pool.query(
        'UPDATE areas SET responsable_id = $1 WHERE id = $2',
        [solicitud.usuario_id, areaFinal]
      );
    }

    // Marcar solicitud como aprobada
    await pool.query(
      `UPDATE solicitudes_encargado 
       SET estado = $1, revisado_por = $2, comentario_revision = $3, revisado_en = NOW() 
       WHERE id = $4`,
      ['aprobada', req.user.id, comentario || 'Aprobado', id]
    );

    await pool.query('COMMIT');

    // Obtener datos del usuario y enviar notificación
    const usuarioResult = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [solicitud.usuario_id]
    );

    if (usuarioResult.rowCount > 0) {
      try {
        await emailService.notificarAprobacion(usuarioResult.rows[0]);
      } catch (emailError) {
        console.error('⚠️ Error al enviar email:', emailError);
      }
    }

    console.log('✅ Solicitud aprobada:', id);

    res.json({
      exito: true,
      mensaje: 'Solicitud aprobada exitosamente'
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Error al aprobar solicitud:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al aprobar solicitud'
    });
  }
});

// RECHAZAR SOLICITUD
router.put('/:id/rechazar', validate(rechazarSolicitudSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;

    await pool.query('BEGIN');

    // Obtener solicitud
    const solicitudResult = await pool.query(
      'SELECT * FROM solicitudes_encargado WHERE id = $1',
      [id]
    );

    if (solicitudResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        exito: false,
        mensaje: 'Solicitud no encontrada'
      });
    }

    const solicitud = solicitudResult.rows[0];

    if (solicitud.estado !== 'pendiente') {
      await pool.query('ROLLBACK');
      return res.status(400).json({
        exito: false,
        mensaje: `Esta solicitud ya fue ${solicitud.estado}`
      });
    }

    // Obtener datos del usuario antes de eliminar
    const usuarioResult = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [solicitud.usuario_id]
    );

    // Marcar solicitud como rechazada
    await pool.query(
      `UPDATE solicitudes_encargado 
       SET estado = $1, revisado_por = $2, comentario_revision = $3, revisado_en = NOW() 
       WHERE id = $4`,
      ['rechazada', req.user.id, comentario || 'Rechazado', id]
    );

    // Eliminar usuario y solicitud
    await pool.query('DELETE FROM usuarios WHERE id = $1', [solicitud.usuario_id]);
    await pool.query('DELETE FROM solicitudes_encargado WHERE id = $1', [id]);

    await pool.query('COMMIT');

    // Enviar notificación de rechazo
    if (usuarioResult.rowCount > 0) {
      try {
        await emailService.notificarRechazo(usuarioResult.rows[0], comentario);
      } catch (emailError) {
        console.error('⚠️ Error al enviar email:', emailError);
      }
    }

    console.log('❌ Solicitud rechazada y usuario eliminado:', id);

    res.json({
      exito: true,
      mensaje: 'Solicitud rechazada y usuario eliminado'
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Error al rechazar solicitud:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al rechazar solicitud'
    });
  }
});

// ELIMINAR SOLICITUD
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('BEGIN');

    const solicitudResult = await pool.query(
      'SELECT usuario_id FROM solicitudes_encargado WHERE id = $1',
      [id]
    );

    if (solicitudResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        exito: false,
        mensaje: 'Solicitud no encontrada'
      });
    }

    const usuarioId = solicitudResult.rows[0].usuario_id;

    // Eliminar solicitud
    await pool.query('DELETE FROM solicitudes_encargado WHERE id = $1', [id]);

    // Eliminar usuario
    await pool.query(
      'DELETE FROM usuarios WHERE id = $1 AND estado_cuenta IN ($2, $3)', 
      [usuarioId, 'pendiente', 'rechazado']
    );

    await pool.query('COMMIT');

    res.json({
      exito: true,
      mensaje: 'Solicitud eliminada'
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Error al eliminar solicitud:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar solicitud'
    });
  }
});

export default router;