import pool from '../config/db.js';

export const getProjects = async () => {
  const result = await pool.query('SELECT * FROM projects');
  return result.rows;
};

export const createProject = async (project) => {
  const { title, description, image_url, date } = project;
  const result = await pool.query(
    'INSERT INTO projects (title, description, image_url, date) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, image_url, date]
  );
  return result.rows[0];
};

export const updateProject = async (id, project) => {
  const { title, description, image_url, date } = project;
  const result = await pool.query(
    'UPDATE projects SET title = $1, description = $2, image_url = $3, date = $4 WHERE id = $5 RETURNING *',
    [title, description, image_url, date, id]
  );
  return result.rows[0];
};

export const deleteProject = async (id) => {
  const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};