import pool from '../config/db.js';

export const getExperiences = async () => {
  const result = await pool.query('SELECT * FROM experiences');
  return result.rows;
};

export const createExperience = async (experience) => {
  const { title, company, start_date, end_date, description } = experience;
  const result = await pool.query(
    'INSERT INTO experiences (title, company, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, company, start_date, end_date, description]
  );
  return result.rows[0];
};

export const updateExperience = async (id, experience) => {
  const { title, company, start_date, end_date, description } = experience;
  const result = await pool.query(
    'UPDATE experiences SET title = $1, company = $2, start_date = $3, end_date = $4, description = $5 WHERE id = $6 RETURNING *',
    [title, company, start_date, end_date, description, id]
  );
  return result.rows[0];
};

export const deleteExperience = async (id) => {
  const result = await pool.query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};