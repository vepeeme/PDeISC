// frontend/constants/api.ts
import { Platform } from 'react-native';

// 🔥 TUS IPs CONFIGURADAS
export const IPS_DISPONIBLES = [
  'http://192.168.1.10:5000',      // ✅ Tu WiFi casa (actual)
  'http://192.168.100.171:5000',   // 🏫 WiFi escuela (respaldo)
];

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    // Para desarrollo web con Expo
    return 'http://localhost:5000';
  }
  
  // Para Android/iOS usar la primera IP disponible
  return IPS_DISPONIBLES[0];
};

export const API_URL = getApiUrl();

export const crearEndpoints = (baseUrl: string) => ({
  registro: `${baseUrl}/auth/registro`,
  login: `${baseUrl}/auth/login`,
  oauth: `${baseUrl}/auth/oauth`,
  usuarios: `${baseUrl}/usuarios`,
  obtenerUsuario: (id: string) => `${baseUrl}/usuarios/${id}`,
  actualizarPerfil: (id: string) => `${baseUrl}/usuarios/${id}`,
  eliminarUsuario: (id: string) => `${baseUrl}/usuarios/${id}`,
});

export const API_ENDPOINTS = crearEndpoints(API_URL);

// Log para debugging
console.log('🌐 Configuración de API:');
console.log('📍 Platform:', Platform.OS);
console.log('📍 API URL principal:', API_URL);
console.log('📍 IPs disponibles:', IPS_DISPONIBLES);