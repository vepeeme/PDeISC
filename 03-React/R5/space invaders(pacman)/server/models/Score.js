import db from '../config/db.js';

const saveScore = async (userId, score) => {
  const [result] = await db.query(
    'INSERT INTO scores (user_id, score) VALUES (?, ?)',
    [userId, score]
  );
  return result;
};

const getLeaderboard = async () => {
  const [rows] = await db.query(`
    SELECT users.username, scores.score, scores.timestamp
    FROM scores
    JOIN users ON scores.user_id = users.id
    ORDER BY scores.score DESC
    LIMIT 10
  `);
  return rows;
};

export { saveScore, getLeaderboard };