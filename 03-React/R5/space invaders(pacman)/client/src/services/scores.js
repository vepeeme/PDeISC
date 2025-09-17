import axios from 'axios';

const API_URL = 'http://localhost:5000/api/scores';

export const saveScore = async (userId, score) => {
  const response = await axios.post(`${API_URL}/save`, { userId, score });
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await axios.get(`${API_URL}/leaderboard`);
  return response.data;
};