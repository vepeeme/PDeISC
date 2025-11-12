// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { Usuario, LoginForm, RegistroTrabajadorForm, RegistroEncargadoForm, CompletarGoogleForm } from '@/types';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (credentials: LoginForm) => Promise<void>;
  signOut: () => Promise<void>;
  registerWorker: (data: RegistroTrabajadorForm) => Promise<void>;
  registerSupervisor: (data: RegistroEncargadoForm) => Promise<{ mensaje: string }>;
  verifyGoogle: (email: string, nombre: string, foto?: string) => Promise<{
    needsCompletion: boolean;
    googleData?: { email: string; nombre: string; foto?: string };
  }>;
  completeGoogleRegister: (data: CompletarGoogleForm) => Promise<{ mensaje: string; isPending?: boolean }>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEncargado: boolean;
  isTrabajador: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const hasSession = await authService.hasSession();
      if (hasSession) {
        const savedUser = await authService.getSavedUser();
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginForm) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response.exito) {
        throw new Error(response.mensaje);
      }

      if (response.usuario) {
        setUser(response.usuario);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const registerWorker = async (data: RegistroTrabajadorForm) => {
    try {
      const response = await authService.registerTrabajador(data);
      
      if (!response.exito) {
        throw new Error(response.mensaje);
      }

      if (response.usuario) {
        setUser(response.usuario);
      }
    } catch (error) {
      throw error;
    }
  };

  const registerSupervisor = async (data: RegistroEncargadoForm) => {
    try {
      const response = await authService.registerEncargado(data);
      
      if (!response.exito) {
        throw new Error(response.mensaje);
      }

      return { mensaje: response.mensaje || 'Solicitud enviada exitosamente' };
    } catch (error) {
      throw error;
    }
  };

  const verifyGoogle = async (email: string, nombre: string, foto?: string) => {
    try {
      const response = await authService.verifyGoogle(email, nombre, foto);
      
      if (!response.exito) {
        throw new Error(response.mensaje);
      }

      if (response.necesita_completar) {
        return {
          needsCompletion: true,
          googleData: response.datos_google,
        };
      }

      if (response.usuario) {
        setUser(response.usuario);
      }

      return { needsCompletion: false };
    } catch (error) {
      throw error;
    }
  };

  const completeGoogleRegister = async (data: CompletarGoogleForm) => {
    try {
      const response = await authService.completarRegistroGoogle(data);
      
      if (!response.exito) {
        throw new Error(response.mensaje);
      }

      // Si es trabajador, ya puede entrar
      if (data.rol === 'trabajador' && response.usuario) {
        setUser(response.usuario);
        return { mensaje: response.mensaje || 'Registro completado exitosamente' };
      }

      // Si es encargado, está pendiente
      return {
        mensaje: response.mensaje || 'Solicitud enviada exitosamente',
        isPending: true,
      };
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authService.refreshUserData();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      // Si falla, cerrar sesión
      await signOut();
    }
  };

  const value: AuthContextData = {
    user,
    loading,
    signIn,
    signOut,
    registerWorker,
    registerSupervisor,
    verifyGoogle,
    completeGoogleRegister,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    isEncargado: user?.rol === 'encargado',
    isTrabajador: user?.rol === 'trabajador',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};