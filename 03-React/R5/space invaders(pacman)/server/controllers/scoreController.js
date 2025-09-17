import { saveScore as modelSaveScore, getLeaderboard as modelGetLeaderboard } from '../models/Score.js';

// Controlador para guardar puntaje (ARREGLADO: ahora usa async/await)
const saveScoreController = async (req, res) => {
  const { userId, score } = req.body;
  
  if (!userId || !score) {
    return res.status(400).json({ error: 'User ID and score are required' });
  }

  try {
    await modelSaveScore(userId, score);
    res.status(201).json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Error saving score' });
  }
};

// Controlador para obtener leaderboard (ARREGLADO: ahora usa async/await)
const getLeaderboardController = async (req, res) => {
  try {
    const results = await modelGetLeaderboard();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
};

export { saveScoreController, getLeaderboardController };