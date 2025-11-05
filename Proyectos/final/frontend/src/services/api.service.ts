// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, STORAGE_KEYS } from '@/constants';

class ApiService {
  private client: AxiosInstance;
  private refreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - agregar token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar errores y refresh token
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Si es 401 y no es la ruta de refresh, intentar refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
          if (this.refreshing) {
            // Si ya se está refrescando, esperar
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.refreshing = false;
            this.onRefreshed(newToken);
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshing = false;
            this.refreshSubscribers = [];
            // Si falla el refresh, cerrar sesión
            await this.clearAuth();
            return Promise.reject(refreshError);
          }
        }

        console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const { accessToken } = response.data;

    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    return accessToken;
  }

  private async clearAuth() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Manejo de errores
  handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Error de respuesta del servidor
        return error.response.data?.mensaje || error.response.data?.error || 'Error del servidor';
      } else if (error.request) {
        // Error de red
        return 'Error de conexión. Verifica tu internet.';
      }
    }
    return error.message || 'Error desconocido';
  }
}

export const apiService = new ApiService();