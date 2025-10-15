// frontend/hooks/useAuth.ts
import { useState } from 'react';
import axios from 'axios';
import { IPS_DISPONIBLES, crearEndpoints } from '@/constants/api';

interface Usuario {
  id: number;
  usuario: string;
  email?: string;
  nombre_completo?: string;
  telefono?: string;
  direccion?: string;
  foto_perfil?: string;
  foto_documento?: string;
  provider?: string;
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

  const intentarConexion = async (
    endpoint: 'registro' | 'login',
    datos: { usuario: string; password: string; email?: string }
  ): Promise<AuthResponse | null> => {
    
    for (let i = 0; i < IPS_DISPONIBLES.length; i++) {
      const baseUrl = IPS_DISPONIBLES[i];
      const endpoints = crearEndpoints(baseUrl);
      
      try {
        console.log(`🔄 Intento ${i + 1}/${IPS_DISPONIBLES.length}: ${baseUrl}`);
        
        const response = await axios.post<AuthResponse>(
          endpoints[endpoint],
          datos,
          { 
            timeout: 15000, // 15 segundos (antes 8000)
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log(`✅ Conectado exitosamente a: ${baseUrl}`);
        return response.data;
        
      } catch (err: any) {
        console.log(`❌ Falló IP ${i + 1}: ${baseUrl}`, err.message);
        
        if (i === IPS_DISPONIBLES.length - 1) {
          throw err;
        }
        continue;
      }
    }
    
    return null;
  };

  const registro = async (usuario: string, password: string): Promise<AuthResponse | null> => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('📝 Iniciando proceso de registro...');
      console.log('📦 Datos a enviar:', { usuario, password: '***' });
      
      const resultado = await intentarConexion('registro', { 
        usuario, 
        password
      });
      
      if (resultado) {
        console.log('✅ Registro completado:', resultado);
        return resultado;
      }
      
      throw new Error('No se pudo conectar con ningún servidor');
      
    } catch (err: any) {
      console.error('❌ Error en registro:', err);
      
      let mensajeError = 'Error de conexión. Verifica:\n' +
        '1. Backend corriendo en terminal\n' +
        '2. IP correcta: 192.168.1.10:5000\n' +
        '3. Misma red WiFi';
      
      if (err.code === 'ECONNABORTED') {
        mensajeError = 'Tiempo agotado. Verifica tu conexión WiFi.';
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        mensajeError = 'No se puede conectar al servidor:\n' +
          '• Verifica que el backend esté corriendo\n' +
          '• Ambos deben estar en la misma red WiFi\n' +
          '• Desactiva firewall si es necesario';
      } else if (err.response?.status === 400) {
        mensajeError = err.response.data.mensaje || 'Datos inválidos';
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
      console.log('🔐 Iniciando proceso de login...');
      
      const resultado = await intentarConexion('login', { usuario, password });
      
      if (resultado) {
        console.log('✅ Login completado:', resultado);
        return resultado;
      }
      
      throw new Error('No se pudo conectar con ningún servidor');
      
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      
      let mensajeError = 'Error de conexión. Verifica:\n' +
        '1. Backend corriendo en terminal\n' +
        '2. IP correcta: 192.168.1.10:5000\n' +
        '3. Misma red WiFi';
      
      if (err.code === 'ECONNABORTED') {
        mensajeError = 'Tiempo agotado. Verifica tu conexión WiFi.';
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        mensajeError = 'No se puede conectar al servidor:\n' +
          '• Verifica que el backend esté corriendo\n' +
          '• Ambos deben estar en la misma red WiFi\n' +
          '• Desactiva firewall si es necesario';
      } else if (err.response?.status === 401) {
        mensajeError = err.response.data.mensaje || 'Usuario o contraseña incorrectos';
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