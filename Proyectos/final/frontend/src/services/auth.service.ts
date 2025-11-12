// src/services/auth.service.ts -
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api.service';
import { STORAGE_KEYS } from '@/constants';
import { 
  AuthResponse, 
  Usuario, 
  LoginForm, 
  RegistroTrabajadorForm, 
  RegistroEncargadoForm,
  CompletarGoogleForm 
} from '@/types';

class AuthService {
  private getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Error desconocido';
  }

  async login(credentials: LoginForm): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.exito && response.accessToken && response.refreshToken) {
        await this.saveTokens(response.accessToken, response.refreshToken);
        if (response.usuario) {
          await this.saveUserData(response.usuario);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async registerTrabajador(data: RegistroTrabajadorForm): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/registro/trabajador', data);
      
      if (response.exito && response.accessToken && response.refreshToken) {
        await this.saveTokens(response.accessToken, response.refreshToken);
        if (response.usuario) {
          await this.saveUserData(response.usuario);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async registerEncargado(data: RegistroEncargadoForm): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/registro/encargado', data);
      return response;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async verifyGoogle(email: string, nombre: string, foto?: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/google/verify', {
        email,
        nombre,
        foto,
      });
      
      if (response.exito && !response.necesita_completar && response.accessToken && response.refreshToken) {
        await this.saveTokens(response.accessToken, response.refreshToken);
        if (response.usuario) {
          await this.saveUserData(response.usuario);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async completarRegistroGoogle(data: CompletarGoogleForm): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/google/completar', data);
      
      // Si es trabajador, guardar tokens
      if (response.exito && response.accessToken && response.refreshToken) {
        await this.saveTokens(response.accessToken, response.refreshToken);
        if (response.usuario) {
          await this.saveUserData(response.usuario);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  private async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  }

  private async saveUserData(usuario: Usuario): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(usuario));
  }

  async getSavedUser(): Promise<Usuario | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async hasSession(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  async refreshUserData(): Promise<Usuario> {
    try {
      const savedUser = await this.getSavedUser();
      if (!savedUser) throw new Error('No hay usuario guardado');

      const response = await apiService.get<{ exito: boolean; usuario: Usuario }>(
        `/usuarios/${savedUser.id}`
      );

      if (response.exito && response.usuario) {
        await this.saveUserData(response.usuario);
        return response.usuario;
      }

      throw new Error('No se pudo actualizar datos del usuario');
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }
}

export const authService = new AuthService();