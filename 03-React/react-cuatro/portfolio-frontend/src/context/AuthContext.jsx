import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Intentando login con:', { username, password });
      console.log('URL base de la API:', api.defaults.baseURL);
      
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.token;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, username });
      
      console.log('Login exitoso');
      return response.data;
    } catch (error) {
      console.error('Error completo de login:', error);
      console.error('Response:', error.response);
      console.error('Request:', error.request);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3001.');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint no encontrado. Verifica que el backend esté configurado correctamente.');
      } else if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else {
        throw new Error('Error de conexión con el servidor');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};