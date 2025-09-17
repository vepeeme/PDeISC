import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data;
};