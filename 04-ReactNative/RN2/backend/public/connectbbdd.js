import mysql from 'mysql2/promise';

export let conexion = null;

export async function conectarBD() {
  try {
    // Crear conexión SIN max_allowed_packet (causa problemas)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'usuarios',
      // ❌ REMOVIDO: maxAllowedPacket (causa error de solo lectura)
    });

    // ❌ REMOVIDO: SET GLOBAL/SESSION (causa errores de permisos)
    // Las fotos base64 funcionarán con el límite por defecto

    // Crear tabla con campos de perfil y OAuth
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        nombre_completo VARCHAR(255),
        telefono VARCHAR(20),
        direccion TEXT,
        latitud DECIMAL(10, 8),
        longitud DECIMAL(11, 8),
        foto_perfil LONGTEXT,
        foto_documento LONGTEXT,
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Agregar columnas si la tabla ya existe
    const columnas = [
      "ADD COLUMN email VARCHAR(255) UNIQUE",
      "ADD COLUMN nombre_completo VARCHAR(255)",
      "ADD COLUMN telefono VARCHAR(20)",
      "ADD COLUMN direccion TEXT",
      "ADD COLUMN latitud DECIMAL(10, 8)",
      "ADD COLUMN longitud DECIMAL(11, 8)",
      "MODIFY COLUMN foto_perfil LONGTEXT",
      "MODIFY COLUMN foto_documento LONGTEXT",
      "ADD COLUMN provider VARCHAR(50) DEFAULT 'local'",
      "ADD COLUMN provider_id VARCHAR(255)",
      "ADD COLUMN actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const columna of columnas) {
      try {
        await connection.execute(`ALTER TABLE usuarios ${columna}`);
      } catch (err) {
        // Ignorar si la columna ya existe
        if (err.code !== 'ER_DUP_FIELDNAME') {
          // Silenciar otros errores menores
        }
      }
    }

    conexion = connection;
    console.log('✅ Conexión establecida y tabla actualizada');
    return conexion;
  } catch (err) {
    console.error('❌ Error al conectar con database "usuarios":', err?.code || err);

    if (err?.code === 'ER_BAD_DB_ERROR' || err?.errno === 1049) {
      try {
        // Crear base de datos si no existe
        const tempConn = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: ''
        });

        await tempConn.execute(`CREATE DATABASE IF NOT EXISTS \`usuarios\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        await tempConn.changeUser({ database: 'usuarios' });

        await tempConn.execute(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            nombre_completo VARCHAR(255),
            telefono VARCHAR(20),
            direccion TEXT,
            latitud DECIMAL(10, 8),
            longitud DECIMAL(11, 8),
            foto_perfil LONGTEXT,
            foto_documento LONGTEXT,
            provider VARCHAR(50) DEFAULT 'local',
            provider_id VARCHAR(255),
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await tempConn.end();

        // Reconectar a la base de datos creada
        const connection2 = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'usuarios'
        });
        
        conexion = connection2;
        console.log('✅ Base de datos "usuarios" creada con tabla completa');
        return conexion;
      } catch (err2) {
        console.error('❌ Error creando la base de datos:', err2);
        throw err2;
      }
    }

    throw err;
  }
} 