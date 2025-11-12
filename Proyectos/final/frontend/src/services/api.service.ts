// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, STORAGE_KEYS } from '@/constants';

class ApiService {
  private client: AxiosInstance;
  private refreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    console.log('🔧 Inicializando ApiService con URL:', API_URL);
    
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('🔵 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasToken: !!token
        });
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // REFRESH TOKEN AUTOMÁTICO
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status
        });
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });

        if (
          error.response?.status === 401 && 
          !originalRequest._retry && 
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          const responseData = error.response?.data as any;
          
          // Solo refrescar si es TOKEN_EXPIRED
          if (responseData?.code === 'TOKEN_EXPIRED') {
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
              // Si falla el refresh, limpiar sesión
              await this.clearAuth();
              return Promise.reject(refreshError);
            }
          }
        }

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

    console.log('🔄 Refrescando token...');
    
    const response = await axios.post(`${API_URL}/auth/refresh`, 
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const { accessToken } = response.data;

    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    console.log('✅ Token refrescado exitosamente');
    return accessToken;
  }

  private async clearAuth() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    console.log('🚪 Sesión limpiada');
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    console.error('🔴 Handling error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data?.mensaje 
          || error.response.data?.error 
          || error.response.data?.message
          || `Error del servidor (${error.response.status})`;
        
        console.error('Server error:', {
          status: error.response.status,
          data: error.response.data,
          message
        });
        
        return new Error(message);
      } else if (error.request) {
        console.error('Network error:', error.request);
        return new Error('Error de conexión. Verifica tu internet y que el servidor esté activo.');
      }
    }
    
    return new Error(error.message || 'Error desconocido');
  }

  //  Método para verificar conectividad
  async checkHealth(): Promise<boolean> {
    try {
      console.log('🏥 Verificando salud del servidor...');
      const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
      console.log('✅ Servidor OK:', response.data);
      return response.data.status === 'OK';
    } catch (error) {
      console.error('❌ Servidor no disponible:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();