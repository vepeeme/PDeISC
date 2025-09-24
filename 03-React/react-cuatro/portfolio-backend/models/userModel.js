import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

export const createDefaultUser = async () => {
  const user = await getUserByUsername('vepeeme');
  if (!user) {
    await createUser('vepeeme', 'vepeeme1234');
    console.log('⚠️ Usuario por defecto creado: vepeeme/vepeeme1234. ¡CAMBIA LA CONTRASEÑA INMEDIATAMENTE!');
  }
};