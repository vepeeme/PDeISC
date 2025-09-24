import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Petición API:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('Respuesta exitosa:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Error en response:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default api;