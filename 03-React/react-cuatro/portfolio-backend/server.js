import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import experiencesRouter from './routes/experiences.js';
import aboutRouter from './routes/about.js';
import authRouter from './routes/auth.js';
import { createDefaultUser } from './models/userModel.js';

// ✅ SOLUCIÓN: Cargar variables de entorno con ruta absoluta
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` }); // Ruta absoluta fija

console.log("DATABASE_URL cargada:", process.env.DATABASE_URL); // Debug

const app = express();
const PORT = process.env.PORT || 3001;

// Crear tablas y usuario por defecto
const createTables = async () => {
  try {
    // Tabla de proyectos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        date VARCHAR(50)
      );
    `);

    // Tabla de habilidades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level INTEGER NOT NULL
      );
    `);

    // Tabla de experiencias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        description TEXT
      );
    `);

    // Tabla de "Sobre mí"
    await pool.query(`
      CREATE TABLE IF NOT EXISTS about (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL
      );
    `);

    // Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    console.log("Tablas creadas o existentes");
  } catch (error) {
    console.error("Error creando tablas:", error);
  }
};

createTables().then(() => {
  createDefaultUser();
});

// Middlewares
app.use(express.json());
app.use(cors());


app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/about', aboutRouter);
app.use('/api/auth', authRouter); // ✅ Montar authRouter bajo /api/auth

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend escuchando en el puerto ${PORT}`);
});