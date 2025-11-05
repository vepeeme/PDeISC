// src/services/auth.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { apiService } from './api.service';
import { STORAGE_KEYS, GOOGLE_CONFIG } from '@/constants';
import { 
  AuthResponse, 
  Usuario, 
  LoginForm, 
  RegistroTrabajadorForm, 
  RegistroEncargadoForm,
  CompletarGoogleForm 
} from '@/types';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
  //  Login tradicional
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
      throw new Error(apiService.handleError(error));
    }
  }

  //  Registro Trabajador
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
      throw new Error(apiService.handleError(error));
    }
  }

  //  Registro Encargado (solicitud)
  async registerEncargado(data: RegistroEncargadoForm): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/registro/encargado', data);
      return response;
    } catch (error) {
      throw new Error(apiService.handleError(error));
    }
  }

  //  Verificar Google (paso 1)
  async verifyGoogle(email: string, nombre: string, foto?: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/google/verify', {
        email,
        nombre,
        foto,
      });
      
      // Si ya existe y está aprobado, guardar tokens
      if (response.exito && !response.necesita_completar && response.accessToken && response.refreshToken) {
        await this.saveTokens(response.accessToken, response.refreshToken);
        if (response.usuario) {
          await this.saveUserData(response.usuario);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(apiService.handleError(error));
    }
  }

  //  Completar registro Google (paso 2)
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
      throw new Error(apiService.handleError(error));
    }
  }

  // 🚪 Logout
  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  //  Guardar tokens
  private async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  }

  //  Guardar datos de usuario
  private async saveUserData(usuario: Usuario): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(usuario));
  }

  //  Obtener usuario guardado
  async getSavedUser(): Promise<Usuario | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // 🔑 Verificar si hay sesión
  async hasSession(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  //  Refrescar datos del usuario
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
      throw new Error(apiService.handleError(error));
    }
  }

  //  Configurar Google Auth
  useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: GOOGLE_CONFIG.androidClientId,
      webClientId: GOOGLE_CONFIG.webClientId,
      expoClientId: GOOGLE_CONFIG.webClientId,
    });

    return { request, response, promptAsync };
  }

  //  Obtener info de Google
  async getGoogleUserInfo(accessToken: string): Promise<{ email: string; name: string; picture?: string }> {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const data = await response.json();
      return {
        email: data.email,
        name: data.name,
        picture: data.picture,
      };
    } catch (error) {
      throw new Error('Error al obtener información de Google');
    }
  }
}

export const authService = new AuthService();