import db from '../config/db.js';

const createUser = async (userData) => {
  const [result] = await db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [userData.username, userData.password, userData.email]
  );
  return result;
};

const findUserByUsername = async (username) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
};

export { createUser, findUserByUsername };