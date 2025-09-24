import pool from '../config/db.js';

export const getAbout = async () => {
  const result = await pool.query('SELECT * FROM about');
  return result.rows;
};

export const createAbout = async (about) => {
  const { content } = about;
  const result = await pool.query(
    'INSERT INTO about (content) VALUES ($1) RETURNING *',
    [content]
  );
  return result.rows[0];
};

export const updateAbout = async (id, about) => {
  const { content } = about;
  const result = await pool.query(
    'UPDATE about SET content = $1 WHERE id = $2 RETURNING *',
    [content, id]
  );
  return result.rows[0];
};

export const deleteAbout = async (id) => {
  const result = await pool.query('DELETE FROM about WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};