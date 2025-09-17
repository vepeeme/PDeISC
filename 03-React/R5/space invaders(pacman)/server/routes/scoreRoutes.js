import express from 'express';
import { saveScoreController, getLeaderboardController } from '../controllers/scoreController.js';
const router = express.Router();

router.post('/save', saveScoreController); // ✅ Usa el nombre corregido
router.get('/leaderboard', getLeaderboardController); // ✅ Usa el nombre corregido

export default router;