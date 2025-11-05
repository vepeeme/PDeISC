// src/routes/areas.routes.js - ✅ GROUP BY CORREGIDO
import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { validate, crearAreaSchema, actualizarAreaSchema } from '../middleware/validation.js';

const router = express.Router();

// RUTA PARA REGISTRO (sin auth)
router.get('/publicas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, descripcion
      FROM areas
      WHERE activo = true
      ORDER BY nombre
    `);

    res.json({
      exito: true,
      total: result.rowCount,
      areas: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener áreas públicas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener áreas'
    });
  }
});

// Middleware de autenticación para las rutas siguientes
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    // ✅ CORREGIDO: Incluir TODAS las columnas en GROUP BY
    const result = await pool.query(`
      SELECT 
        a.id, a.nombre, a.descripcion, a.responsable_id, a.activo, a.creado_en, a.actualizado_en,
        u.nombre_completo as responsable_nombre,
        u.email as responsable_email,
        u.foto_perfil as responsable_foto,
        COUNT(DISTINCT t.id) as total_trabajadores,
        COUNT(DISTINCT ac.id) as total_actividades
      FROM areas a
      LEFT JOIN usuarios u ON a.responsable_id = u.id
      LEFT JOIN trabajadores t ON a.id = t.area_id AND t.activo = true
      LEFT JOIN actividades ac ON a.id = ac.area_id
      WHERE a.activo = true
      GROUP BY a.id, a.nombre, a.descripcion, a.responsable_id, a.activo, a.creado_en, a.actualizado_en,
               u.nombre_completo, u.email, u.foto_perfil
      ORDER BY a.nombre
    `);

    res.json({
      exito: true,
      total: result.rowCount,
      areas: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener áreas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener áreas'
    });
  }
});

// Obtener detalles de un área específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        a.*, 
        u.nombre_completo as responsable_nombre,
        u.email as responsable_email,
        u.foto_perfil as responsable_foto
      FROM areas a
      LEFT JOIN usuarios u ON a.responsable_id = u.id
      WHERE a.id = $1 AND a.activo = true
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Área no encontrada'
      });
    }

    const trabajadoresResult = await pool.query(`
      SELECT 
        u.id, u.nombre_completo, u.email, u.foto_perfil,
        t.puesto, t.nivel_capacitacion, t.fecha_ingreso
      FROM trabajadores t
      INNER JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.area_id = $1 AND t.activo = true
      ORDER BY u.nombre_completo
    `, [id]);

    const actividadesResult = await pool.query(`
      SELECT 
        id, titulo, descripcion, estado, prioridad, 
        fecha_inicio, fecha_fin_estimada
      FROM actividades
      WHERE area_id = $1
      ORDER BY creado_en DESC
      LIMIT 10
    `, [id]);

    res.json({
      exito: true,
      area: {
        ...result.rows[0],
        trabajadores: trabajadoresResult.rows,
        actividades_recientes: actividadesResult.rows
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener área:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener área'
    });
  }
});

// Crear una nueva área
router.post('/', requireRole('admin'), validate(crearAreaSchema), async (req, res) => {
  try {
    const { nombre, descripcion, responsable_id } = req.body;

    const existingResult = await pool.query(
      'SELECT id FROM areas WHERE nombre = $1 AND activo = true',
      [nombre]
    );

    if (existingResult.rowCount > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe un área con ese nombre'
      });
    }

    if (responsable_id) {
      const userResult = await pool.query(
        'SELECT rol FROM usuarios WHERE id = $1 AND activo = true',
        [responsable_id]
      );

      if (userResult.rowCount === 0 || userResult.rows[0].rol !== 'encargado') {
        return res.status(400).json({
          exito: false,
          mensaje: 'El responsable debe ser un usuario con rol encargado'
        });
      }
    }

    const result = await pool.query(
      'INSERT INTO areas (nombre, descripcion, responsable_id) VALUES ($1, $2, $3) RETURNING id',
      [nombre, descripcion || null, responsable_id || null]
    );

    console.log('✅ Área creada:', result.rows[0].id);

    res.status(201).json({
      exito: true,
      mensaje: 'Área creada exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error al crear área:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear área'
    });
  }
});

// Actualizar un área existente
router.put('/:id', requireRole('admin'), validate(actualizarAreaSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, responsable_id } = req.body;

    const existingResult = await pool.query(
      'SELECT id FROM areas WHERE id = $1 AND activo = true',
      [id]
    );

    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Área no encontrada'
      });
    }

    const duplicateResult = await pool.query(
      'SELECT id FROM areas WHERE nombre = $1 AND id != $2 AND activo = true',
      [nombre, id]
    );

    if (duplicateResult.rowCount > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe otra área con ese nombre'
      });
    }

    if (responsable_id) {
      const userResult = await pool.query(
        'SELECT rol FROM usuarios WHERE id = $1 AND activo = true',
        [responsable_id]
      );

      if (userResult.rowCount === 0 || userResult.rows[0].rol !== 'encargado') {
        return res.status(400).json({
          exito: false,
          mensaje: 'El responsable debe ser un usuario con rol encargado'
        });
      }
    }

    await pool.query(
      'UPDATE areas SET nombre = $1, descripcion = $2, responsable_id = $3 WHERE id = $4',
      [nombre, descripcion, responsable_id, id]
    );

    res.json({
      exito: true,
      mensaje: 'Área actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar área:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar área'
    });
  }
});

// Eliminar un área
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const actividadesResult = await pool.query(
      "SELECT COUNT(*) as total FROM actividades WHERE area_id = $1 AND estado NOT IN ('Finalizada', 'Cancelada')",
      [id]
    );

    if (parseInt(actividadesResult.rows[0].total) > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No se puede eliminar un área con actividades activas'
      });
    }

    await pool.query(
      'UPDATE areas SET activo = false WHERE id = $1',
      [id]
    );

    res.json({
      exito: true,
      mensaje: 'Área eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar área:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar área'
    });
  }
});

// Obtener estadísticas de un área
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const trabajadoresResult = await pool.query(
      'SELECT COUNT(*) as total FROM trabajadores WHERE area_id = $1 AND activo = true',
      [id]
    );

    const actividadesPorEstadoResult = await pool.query(
      'SELECT estado, COUNT(*) as cantidad FROM actividades WHERE area_id = $1 GROUP BY estado',
      [id]
    );

    const pendientesResult = await pool.query(
      "SELECT COUNT(*) as total FROM actividades WHERE area_id = $1 AND estado = 'Pendiente'",
      [id]
    );

    const enProgresoResult = await pool.query(
      "SELECT COUNT(*) as total FROM actividades WHERE area_id = $1 AND estado = 'En Progreso'",
      [id]
    );

    res.json({
      exito: true,
      estadisticas: {
        total_trabajadores: trabajadoresResult.rows[0].total,
        actividades_pendientes: pendientesResult.rows[0].total,
        actividades_en_progreso: enProgresoResult.rows[0].total,
        actividades_por_estado: actividadesPorEstadoResult.rows
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener estadísticas del área'
    });
  }
});

export default router;