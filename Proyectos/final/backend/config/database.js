// backend/src/config/database.js
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

export let pool = null;

// Función auxiliar para obtener el pool
export function getPool() {
  if (!pool) {
    throw new Error('Database pool no inicializado. Llama a conectarBD() primero.');
  }
  return pool;
}

export async function conectarBD() {
  try {
    //  Crear pool de PostgreSQL
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        `postgresql://proyecto_final_db_wvxl_user:DjLDQogPgX5A1jyUvmEuakdTGrbmRiHM@dpg-d49jgts9c44c73bn7g3g-a.oregon-postgres.render.com/proyecto_final_db_wvxl`,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false } 
          : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // 🧠 Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL establecida');

    // Crear tablas si no existen
    await crearTablas();

    // Insertar usuarios de ejemplo si la BD está vacía
    await insertarUsuariosEjemploSiVacio();

    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err?.message || err);
    throw err;
  }
}

async function crearTablas() {
  console.log('📋 Creando/verificando tablas en PostgreSQL...');

  try {
    // TABLA USUARIOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre_completo VARCHAR(255),
        telefono VARCHAR(20),
        foto_perfil TEXT,
        rol VARCHAR(20) DEFAULT 'trabajador' CHECK (rol IN ('admin', 'encargado', 'trabajador')),
        provider VARCHAR(20) DEFAULT 'local' CHECK (provider IN ('local', 'google')),
        provider_id VARCHAR(255),
        estado_cuenta VARCHAR(20) DEFAULT 'activo' CHECK (estado_cuenta IN ('activo', 'pendiente', 'rechazado', 'suspendido')),
        activo BOOLEAN DEFAULT true,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
      CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado_cuenta);
    `);

    // TABLA ÁREAS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS areas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL UNIQUE,
        descripcion TEXT,
        responsable_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        activo BOOLEAN DEFAULT true,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_areas_nombre ON areas(nombre);
    `);

    //TABLA SOLICITUDES ENCARGADO
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes_encargado (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        area_solicitada_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
        motivo TEXT,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
        revisado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        comentario_revision TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        revisado_en TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_encargado(estado);
    `);

    // TABLA TRABAJADORES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trabajadores (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
        area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
        puesto VARCHAR(100),
        nivel_capacitacion VARCHAR(20) DEFAULT 'Básico' CHECK (nivel_capacitacion IN ('Básico', 'Intermedio', 'Avanzado')),
        fecha_ingreso DATE,
        activo BOOLEAN DEFAULT true,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_trabajadores_area ON trabajadores(area_id);
    `);

    // TABLA ACTIVIDADES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividades (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT,
        area_id INTEGER REFERENCES areas(id) ON DELETE SET NULL,
        encargado_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        creado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        prioridad VARCHAR(20) DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
        estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Progreso', 'Finalizada', 'Bloqueada', 'Cancelada')),
        fecha_inicio TIMESTAMP,
        fecha_fin_estimada TIMESTAMP,
        fecha_fin_real TIMESTAMP,
        progreso_porcentaje INTEGER DEFAULT 0 CHECK (progreso_porcentaje >= 0 AND progreso_porcentaje <= 100),
        observaciones TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades(estado);
      CREATE INDEX IF NOT EXISTS idx_actividades_prioridad ON actividades(prioridad);
      CREATE INDEX IF NOT EXISTS idx_actividades_fecha_inicio ON actividades(fecha_inicio);
    `);

    // TABLA ACTIVIDAD_TRABAJADOR
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividad_trabajador (
        actividad_id INTEGER REFERENCES actividades(id) ON DELETE CASCADE,
        trabajador_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        rol_en_actividad VARCHAR(100),
        asignado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (actividad_id, trabajador_id)
      );
    `);

    // TABLA ACTIVIDAD_COMENTARIOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividad_comentarios (
        id SERIAL PRIMARY KEY,
        actividad_id INTEGER REFERENCES actividades(id) ON DELETE CASCADE,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        mensaje TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_comentarios_actividad ON actividad_comentarios(actividad_id);
    `);

    // TABLA ACTIVIDAD_ADJUNTOS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividad_adjuntos (
        id SERIAL PRIMARY KEY,
        actividad_id INTEGER REFERENCES actividades(id) ON DELETE CASCADE,
        archivo_url TEXT,
        nombre_original VARCHAR(255),
        tipo_archivo VARCHAR(100),
        tamanio_bytes INTEGER,
        subido_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_adjuntos_actividad ON actividad_adjuntos(actividad_id);
    `);

    console.log('✅ Tablas creadas/verificadas exitosamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
    throw error;
  }
}

async function insertarUsuariosEjemploSiVacio() {
  try {
    // Verificar si hay usuarios
    const result = await pool.query('SELECT COUNT(*) as total FROM usuarios');
    const total = parseInt(result.rows[0].total);

    if (total > 0) {
      console.log('ℹ️  Ya existen usuarios en la base de datos');
      return;
    }

    console.log('📦 Insertando usuarios de ejemplo...');

    // Hashear contraseñas
    const adminPass = await bcrypt.hash('Admin123!', 10);
    const encargadoPass = await bcrypt.hash('Encargado123!', 10);
    const trabajadorPass = await bcrypt.hash('Trabajador123!', 10);

    // Insertar áreas primero
    await pool.query(`
      INSERT INTO areas (nombre, descripcion) VALUES
      ('Tejido', 'Área de producción de tejidos y telas'),
      ('Corte', 'Área de corte de patrones y telas'),
      ('Confección', 'Área de confección y costura'),
      ('Empaque', 'Área de empaque y distribución'),
      ('Control de Calidad', 'Área de inspección y control de calidad'),
      ('Almacén', 'Gestión de materias primas y producto terminado')
      ON CONFLICT DO NOTHING
    `);

    // 1. ADMIN
    const adminResult = await pool.query(
      `INSERT INTO usuarios (usuario, password, email, nombre_completo, rol, estado_cuenta) 
       VALUES ($1, $2, $3, $4, 'admin', 'activo') RETURNING id`,
      ['admin', adminPass, 'admin@fabricatextil.com', 'Administrador Sistema']
    );

    // 2. ENCARGADO
    const encargadoResult = await pool.query(
      `INSERT INTO usuarios (usuario, password, email, nombre_completo, telefono, rol, estado_cuenta) 
       VALUES ($1, $2, $3, $4, $5, 'encargado', 'activo') RETURNING id`,
      ['encargado1', encargadoPass, 'encargado@fabricatextil.com', 'Juan Pérez', '1234567890']
    );

    // Asignar encargado como responsable del área Tejido
    await pool.query(
      'UPDATE areas SET responsable_id = $1 WHERE id = 1',
      [encargadoResult.rows[0].id]
    );

    // 3. TRABAJADOR
    const trabajadorResult = await pool.query(
      `INSERT INTO usuarios (usuario, password, email, nombre_completo, telefono, rol, estado_cuenta) 
       VALUES ($1, $2, $3, $4, $5, 'trabajador', 'activo') RETURNING id`,
      ['trabajador1', trabajadorPass, 'trabajador@fabricatextil.com', 'Carlos Rodríguez', '0987654321']
    );

    // Crear perfil de trabajador en área Tejido
    await pool.query(
      'INSERT INTO trabajadores (usuario_id, area_id, puesto, nivel_capacitacion, fecha_ingreso) VALUES ($1, 1, $2, $3, CURRENT_DATE)',
      [trabajadorResult.rows[0].id, 'Operario', 'Básico']
    );

    console.log('✅ Usuarios de ejemplo creados exitosamente:');
    console.log('');
    console.log('┌──────────────────────────────────────────────────┐');
    console.log('│  👤 USUARIOS DE PRUEBA                            │');
    console.log('├──────────────────────────────────────────────────┤');
    console.log('│  👑 ADMIN                                         │');
    console.log('│     Usuario: admin                                │');
    console.log('│     Password: Admin123!                           │');
    console.log('│     Email: admin@fabricatextil.com                │');
    console.log('├──────────────────────────────────────────────────┤');
    console.log('│  ⚙️  ENCARGADO                                     │');
    console.log('│     Usuario: encargado1                           │');
    console.log('│     Password: Encargado123!                       │');
    console.log('│     Email: encargado@fabricatextil.com            │');
    console.log('│     Área: Tejido                                  │');
    console.log('├──────────────────────────────────────────────────┤');
    console.log('│  👷 TRABAJADOR                                     │');
    console.log('│     Usuario: trabajador1                          │');
    console.log('│     Password: Trabajador123!                      │');
    console.log('│     Email: trabajador@fabricatextil.com           │');
    console.log('│     Área: Tejido                                  │');
    console.log('└──────────────────────────────────────────────────┘');
    console.log('');
  } catch (error) {
    console.error('❌ Error al insertar usuarios de ejemplo:', error);
  }
}

export default { conectarBD, pool };