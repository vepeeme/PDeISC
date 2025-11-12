// backend/src/routes/actividades.routes.js
import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { 
  validate, 
  crearActividadSchema, 
  actualizarActividadSchema,
  asignarTrabajadoresSchema,
  agregarComentarioSchema 
} from '../middleware/validation.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// 📊 DASHBOARD / ESTADÍSTICAS - ✅ CORREGIDO
router.get('/dashboard/stats', async (req, res) => {
  try {
    let stats = {};

    console.log('🔍 Obteniendo stats para rol:', req.user.rol);

    if (req.user.rol === 'admin') {
      // Admin ve todo
      const totalUsuariosResult = await pool.query(
        'SELECT COUNT(*)::integer as total FROM usuarios WHERE activo = true'
      );
      
      const totalAreasResult = await pool.query(
        'SELECT COUNT(*)::integer as total FROM areas WHERE activo = true'
      );
      
      const totalActividadesResult = await pool.query(
        'SELECT COUNT(*)::integer as total FROM actividades'
      );
      
      const actividadesPorEstadoResult = await pool.query(`
        SELECT estado, COUNT(*)::integer as cantidad
        FROM actividades
        GROUP BY estado
      `);

      stats = {
        totalUsuarios: totalUsuariosResult.rows[0].total,
        totalAreas: totalAreasResult.rows[0].total,
        totalActividades: totalActividadesResult.rows[0].total,
        actividadesPorEstado: actividadesPorEstadoResult.rows
      };

    } else if (req.user.rol === 'encargado') {
      // Encargado ve sus actividades
      const misActividadesResult = await pool.query(
        'SELECT COUNT(*)::integer as total FROM actividades WHERE encargado_id = $1',
        [req.user.id]
      );
      
      const actividadesPorEstadoResult = await pool.query(`
        SELECT estado, COUNT(*)::integer as cantidad
        FROM actividades
        WHERE encargado_id = $1
        GROUP BY estado
      `, [req.user.id]);

      const trabajadoresAreaResult = await pool.query(`
        SELECT COUNT(DISTINCT t.id)::integer as total
        FROM trabajadores t
        INNER JOIN areas a ON t.area_id = a.id
        WHERE a.responsable_id = $1 AND t.activo = true
      `, [req.user.id]);

      stats = {
        misActividades: misActividadesResult.rows[0].total,
        actividadesPorEstado: actividadesPorEstadoResult.rows,
        trabajadoresEnMiArea: trabajadoresAreaResult.rows[0]?.total || 0
      };

    } else if (req.user.rol === 'trabajador') {
      // Trabajador ve sus actividades asignadas
      const misActividadesResult = await pool.query(`
        SELECT COUNT(*)::integer as total
        FROM actividad_trabajador
        WHERE trabajador_id = $1
      `, [req.user.id]);
      
      const actividadesPorEstadoResult = await pool.query(`
        SELECT a.estado, COUNT(*)::integer as cantidad
        FROM actividades a
        INNER JOIN actividad_trabajador at ON a.id = at.actividad_id
        WHERE at.trabajador_id = $1
        GROUP BY a.estado
      `, [req.user.id]);

      stats = {
        misActividades: misActividadesResult.rows[0].total,
        actividadesPorEstado: actividadesPorEstadoResult.rows
      };
    }

    console.log('✅ Stats obtenidas:', stats);

    res.json({
      exito: true,
      stats
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 📋 LISTAR ACTIVIDADES
router.get('/', async (req, res) => {
  try {
    const { area_id, estado, prioridad, encargado_id } = req.query;

    let query = `
      SELECT 
        a.*,
        ar.nombre as area_nombre,
        u.nombre_completo as encargado_nombre,
        c.nombre_completo as creado_por_nombre,
        COUNT(DISTINCT at.trabajador_id)::integer as total_trabajadores
      FROM actividades a
      LEFT JOIN areas ar ON a.area_id = ar.id
      LEFT JOIN usuarios u ON a.encargado_id = u.id
      LEFT JOIN usuarios c ON a.creado_por = c.id
      LEFT JOIN actividad_trabajador at ON a.id = at.actividad_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    // Filtro por rol del usuario
    if (req.user.rol === 'encargado') {
      query += ` AND a.encargado_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    } else if (req.user.rol === 'trabajador') {
      query += ` AND a.id IN (SELECT actividad_id FROM actividad_trabajador WHERE trabajador_id = $${paramIndex})`;
      params.push(req.user.id);
      paramIndex++;
    }

    // Filtros adicionales
    if (area_id) {
      query += ` AND a.area_id = $${paramIndex}`;
      params.push(area_id);
      paramIndex++;
    }

    if (estado) {
      query += ` AND a.estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (prioridad) {
      query += ` AND a.prioridad = $${paramIndex}`;
      params.push(prioridad);
      paramIndex++;
    }

    if (encargado_id) {
      query += ` AND a.encargado_id = $${paramIndex}`;
      params.push(encargado_id);
      paramIndex++;
    }

    query += ` 
      GROUP BY a.id, a.titulo, a.descripcion, a.area_id, a.encargado_id, a.creado_por,
               a.prioridad, a.estado, a.fecha_inicio, a.fecha_fin_estimada, a.fecha_fin_real,
               a.progreso_porcentaje, a.observaciones, a.creado_en, a.actualizado_en,
               ar.nombre, u.nombre_completo, c.nombre_completo
      ORDER BY a.creado_en DESC
    `;

    const result = await pool.query(query, params);

    res.json({
      exito: true,
      total: result.rowCount,
      actividades: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener actividades:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener actividades'
    });
  }
});

// 🔍 OBTENER ACTIVIDAD POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        a.*,
        ar.nombre as area_nombre,
        u.nombre_completo as encargado_nombre,
        u.email as encargado_email,
        c.nombre_completo as creado_por_nombre
      FROM actividades a
      LEFT JOIN areas ar ON a.area_id = ar.id
      LEFT JOIN usuarios u ON a.encargado_id = u.id
      LEFT JOIN usuarios c ON a.creado_por = c.id
      WHERE a.id = $1
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Actividad no encontrada'
      });
    }

    // Obtener trabajadores asignados
    const trabajadoresResult = await pool.query(`
      SELECT 
        u.id, u.nombre_completo, u.email, u.foto_perfil,
        at.rol_en_actividad, at.asignado_en
      FROM actividad_trabajador at
      INNER JOIN usuarios u ON at.trabajador_id = u.id
      WHERE at.actividad_id = $1
      ORDER BY u.nombre_completo
    `, [id]);

    // Obtener comentarios
    const comentariosResult = await pool.query(`
      SELECT 
        c.*, 
        u.nombre_completo as usuario_nombre, 
        u.foto_perfil as usuario_foto
      FROM actividad_comentarios c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.actividad_id = $1
      ORDER BY c.creado_en DESC
    `, [id]);

    res.json({
      exito: true,
      actividad: {
        ...result.rows[0],
        trabajadores: trabajadoresResult.rows,
        comentarios: comentariosResult.rows
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener actividad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener actividad'
    });
  }
});

// ➕ CREAR ACTIVIDAD
router.post('/', requireRole('admin', 'encargado'), validate(crearActividadSchema), async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      area_id,
      encargado_id,
      prioridad,
      fecha_inicio,
      fecha_fin_estimada
    } = req.body;

    // Verificar que el área existe
    const areaResult = await pool.query(
      'SELECT id FROM areas WHERE id = $1 AND activo = true',
      [area_id]
    );

    if (areaResult.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Área no encontrada'
      });
    }

    // Si se especifica encargado, verificar que existe
    if (encargado_id) {
      const encargadoResult = await pool.query(
        'SELECT id FROM usuarios WHERE id = $1 AND rol IN ($2, $3) AND activo = true',
        [encargado_id, 'admin', 'encargado']
      );

      if (encargadoResult.rowCount === 0) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Encargado no válido'
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO actividades (
        titulo, descripcion, area_id, encargado_id, creado_por,
        prioridad, fecha_inicio, fecha_fin_estimada, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        titulo,
        descripcion || null,
        area_id,
        encargado_id || req.user.id,
        req.user.id,
        prioridad || 'Media',
        fecha_inicio || null,
        fecha_fin_estimada || null,
        'Pendiente'
      ]
    );

    console.log('✅ Actividad creada:', result.rows[0].id);

    res.status(201).json({
      exito: true,
      mensaje: 'Actividad creada exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error al crear actividad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear actividad'
    });
  }
});

// ✏️ ACTUALIZAR ACTIVIDAD
router.put('/:id', requireRole('admin', 'encargado'), validate(actualizarActividadSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      prioridad,
      estado,
      fecha_inicio,
      fecha_fin_estimada,
      fecha_fin_real,
      progreso_porcentaje
    } = req.body;

    // Verificar que la actividad existe
    const actividadResult = await pool.query(
      'SELECT encargado_id FROM actividades WHERE id = $1',
      [id]
    );

    if (actividadResult.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Actividad no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'encargado' && actividadResult.rows[0].encargado_id !== req.user.id) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permisos para actualizar esta actividad'
      });
    }

    // Construir query dinámico
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (titulo !== undefined) {
      updates.push(`titulo = $${paramIndex}`);
      params.push(titulo);
      paramIndex++;
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramIndex}`);
      params.push(descripcion);
      paramIndex++;
    }
    if (prioridad !== undefined) {
      updates.push(`prioridad = $${paramIndex}`);
      params.push(prioridad);
      paramIndex++;
    }
    if (estado !== undefined) {
      updates.push(`estado = $${paramIndex}`);
      params.push(estado);
      paramIndex++;
      
      if (estado === 'Finalizada' && !fecha_fin_real) {
        updates.push('fecha_fin_real = NOW()');
      }
    }
    if (fecha_inicio !== undefined) {
      updates.push(`fecha_inicio = $${paramIndex}`);
      params.push(fecha_inicio);
      paramIndex++;
    }
    if (fecha_fin_estimada !== undefined) {
      updates.push(`fecha_fin_estimada = $${paramIndex}`);
      params.push(fecha_fin_estimada);
      paramIndex++;
    }
    if (fecha_fin_real !== undefined) {
      updates.push(`fecha_fin_real = $${paramIndex}`);
      params.push(fecha_fin_real);
      paramIndex++;
    }
    if (progreso_porcentaje !== undefined) {
      updates.push(`progreso_porcentaje = $${paramIndex}`);
      params.push(progreso_porcentaje);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No hay campos para actualizar'
      });
    }

    params.push(id);
    const query = `UPDATE actividades SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    
    await pool.query(query, params);

    console.log('✅ Actividad actualizada:', id);

    res.json({
      exito: true,
      mensaje: 'Actividad actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar actividad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar actividad'
    });
  }
});

// ✅ MARCAR COMO COMPLETADA (para trabajadores)
router.put('/:id/completar', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT estado FROM actividades WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Actividad no encontrada'
      });
    }

    // Verificar que es el trabajador asignado
    if (req.user.rol === 'trabajador') {
      const asignacionResult = await pool.query(
        'SELECT * FROM actividad_trabajador WHERE actividad_id = $1 AND trabajador_id = $2',
        [id, req.user.id]
      );

      if (asignacionResult.rowCount === 0) {
        return res.status(403).json({
          exito: false,
          mensaje: 'No estás asignado a esta actividad'
        });
      }
    }

    if (result.rows[0].estado === 'Finalizada' || result.rows[0].estado === 'Cancelada') {
      return res.status(400).json({
        exito: false,
        mensaje: `Esta actividad ya está ${result.rows[0].estado.toLowerCase()}`
      });
    }

    await pool.query(
      `UPDATE actividades SET
        estado = 'Finalizada',
        progreso_porcentaje = 100,
        fecha_fin_real = NOW()
      WHERE id = $1`,
      [id]
    );

    console.log(`✅ Actividad ${id} marcada como completada`);

    res.json({
      exito: true,
      mensaje: 'Actividad marcada como completada'
    });
  } catch (error) {
    console.error('❌ Error al completar actividad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al completar actividad'
    });
  }
});

// 🗑️ ELIMINAR ACTIVIDAD
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM actividades WHERE id = $1', [id]);

    res.json({
      exito: true,
      mensaje: 'Actividad eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar actividad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar actividad'
    });
  }
});

// 👥 ASIGNAR TRABAJADORES
router.post('/:id/asignar', requireRole('admin', 'encargado'), validate(asignarTrabajadoresSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { trabajadores } = req.body;

    const actividadResult = await pool.query(
      'SELECT id FROM actividades WHERE id = $1',
      [id]
    );

    if (actividadResult.rowCount === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Actividad no encontrada'
      });
    }

    // Eliminar asignaciones previas
    await pool.query(
      'DELETE FROM actividad_trabajador WHERE actividad_id = $1',
      [id]
    );

    // Insertar nuevas asignaciones
    for (const t of trabajadores) {
      await pool.query(
        'INSERT INTO actividad_trabajador (actividad_id, trabajador_id, rol_en_actividad) VALUES ($1, $2, $3)',
        [id, t.trabajador_id, t.rol_en_actividad || 'Operario']
      );
    }

    console.log('✅ Trabajadores asignados a actividad:', id);

    res.json({
      exito: true,
      mensaje: 'Trabajadores asignados exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al asignar trabajadores:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al asignar trabajadores'
    });
  }
});

// 💬 AGREGAR COMENTARIO
router.post('/:id/comentarios', validate(agregarComentarioSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;

    const result = await pool.query(
      'INSERT INTO actividad_comentarios (actividad_id, usuario_id, mensaje) VALUES ($1, $2, $3) RETURNING id',
      [id, req.user.id, mensaje]
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Comentario agregado exitosamente',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error al agregar comentario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al agregar comentario'
    });
  }
});

// 💬 OBTENER COMENTARIOS
router.get('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        c.*, 
        u.nombre_completo as usuario_nombre, 
        u.foto_perfil as usuario_foto,
        u.rol as usuario_rol
      FROM actividad_comentarios c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.actividad_id = $1
      ORDER BY c.creado_en DESC
    `, [id]);

    res.json({
      exito: true,
      total: result.rowCount,
      comentarios: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener comentarios'
    });
  }
});

export default router;