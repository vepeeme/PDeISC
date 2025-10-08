import { Platform } from 'react-native';

export const IPS_DISPONIBLES = [
  'http://192.168.1.55:5000',
  'http://192.168.100.171:5000',
];

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  return IPS_DISPONIBLES[0];
};

export const API_URL = getApiUrl();

export const crearEndpoints = (baseUrl: string) => ({
  registro: `${baseUrl}/auth/registro`,
  login: `${baseUrl}/auth/login`,
  usuarios: `${baseUrl}/usuarios`,
});

export const API_ENDPOINTS = crearEndpoints(API_URL);

console.log('🌐 IPs configuradas:', IPS_DISPONIBLES);
console.log('🌐 API URL principal:', API_URL);