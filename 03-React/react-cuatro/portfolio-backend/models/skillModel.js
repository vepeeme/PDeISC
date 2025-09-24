import pool from '../config/db.js';

export const getSkills = async () => {
  const result = await pool.query('SELECT * FROM skills');
  return result.rows;
};

export const createSkill = async (skill) => {
  const { name, level } = skill;
  const result = await pool.query(
    'INSERT INTO skills (name, level) VALUES ($1, $2) RETURNING *',
    [name, level]
  );
  return result.rows[0];
};

export const updateSkill = async (id, skill) => {
  const { name, level } = skill;
  const result = await pool.query(
    'UPDATE skills SET name = $1, level = $2 WHERE id = $3 RETURNING *',
    [name, level, id]
  );
  return result.rows[0];
};

export const deleteSkill = async (id) => {
  const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};