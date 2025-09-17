import mysql from 'mysql2/promise'; // ✅ Usar versión promise
import dotenv from 'dotenv';

dotenv.config();

// Crear base de datos y pool de conexiones
const createDatabaseAndPool = async () => {
  // Conexión inicial sin base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Crear base de datos si no existe
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log(`Database ${process.env.DB_NAME} created or exists`);

  // Crear pool con la base de datos
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Crear tablas
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Users table created or exists');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS scores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      score INT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('Scores table created or exists');

  return pool;
};

// ✅ Top-level await (permite esperar a la inicialización de la DB)
const pool = await createDatabaseAndPool();
export default pool;