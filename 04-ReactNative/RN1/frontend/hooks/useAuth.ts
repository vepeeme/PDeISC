import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/api';

interface Usuario {
  id: number;
  usuario: string;
  creado_en?: string;
}

interface AuthResponse {
  exito: boolean;
  mensaje: string;
  usuario?: Usuario;
}

export const useAuth = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registro = async (usuario: string, password: string): Promise<AuthResponse | null> => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('🔄 Intentando registro en:', API_ENDPOINTS.registro);
      
      const response = await axios.post<AuthResponse>(
        API_ENDPOINTS.registro,
        { usuario, password },
        { timeout: 15000 }
      );
      
      console.log('✅ Registro exitoso:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('❌ Error en registro:', err);
      
      let mensajeError = 'Error al registrar usuario';
      
      if (err.code === 'ECONNABORTED') {
        mensajeError = 'Tiempo agotado. Verifica tu conexión WiFi.';
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        mensajeError = 'No se puede conectar al servidor (192.168.1.55:5000). Verifica:\n1. Backend corriendo\n2. Misma red WiFi\n3. Firewall desactivado';
      } else if (err.response?.data?.mensaje) {
        mensajeError = err.response.data.mensaje;
      }
      
      setError(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const login = async (usuario: string, password: string): Promise<AuthResponse | null> => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('🔄 Intentando login en:', API_ENDPOINTS.login);
      
      const response = await axios.post<AuthResponse>(
        API_ENDPOINTS.login,
        { usuario, password },
        { timeout: 15000 }
      );
      
      console.log('✅ Login exitoso:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      
      let mensajeError = 'Error al iniciar sesión';
      
      if (err.code === 'ECONNABORTED') {
        mensajeError = 'Tiempo agotado. Verifica tu conexión WiFi.';
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        mensajeError = 'No se puede conectar al servidor (192.168.1.55:5000). Verifica:\n1. Backend corriendo\n2. Misma red WiFi\n3. Firewall desactivado';
      } else if (err.response?.data?.mensaje) {
        mensajeError = err.response.data.mensaje;
      }
      
      setError(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { registro, login, cargando, error };
};