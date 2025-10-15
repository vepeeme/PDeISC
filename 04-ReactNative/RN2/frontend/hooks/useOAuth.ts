// frontend/hooks/useOAuth.ts
import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  exchangeCodeAsync,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// ⚙️ Importante: inicializa el manejador del navegador
WebBrowser.maybeCompleteAuthSession();

const API_URL = 'http://localhost:5000'; // cambia si tu backend está en otra IP

export function useOAuth() {
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  // 🔐 Tus client IDs de Google
  const CLIENT_ID_ANDROID =
    '581190540985-d72m0c102i3cn1j68htnos7k4rp4p7o0.apps.googleusercontent.com';
  const CLIENT_ID_WEB =
    '581190540985-ebbec109kp47ti4us12nvrvvgu5d70cj.apps.googleusercontent.com';

  const discovery = useAutoDiscovery('https://accounts.google.com');

  const redirectUri = makeRedirectUri({
    native: 'frontend://redirect',
    useProxy: Platform.OS !== 'web', // Expo Go usa proxy
  });

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: Platform.OS === 'web' ? CLIENT_ID_WEB : CLIENT_ID_ANDROID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: 'code', // 🔑 flujo moderno con authorization code
    },
    discovery
  );

  const loginConGoogle = async () => {
    try {
      setCargando(true);

      const result = await promptAsync({ useProxy: Platform.OS !== 'web' } as any);

      if (result.type !== 'success' || !result.params?.code) {
        console.warn('⚠️ Autenticación cancelada o sin código', result);
        Alert.alert('Error', 'No se pudo completar el inicio con Google');
        return;
      }

      console.log('✅ Código recibido de Google:', result.params.code);

      // 📩 Intercambiar el código por el token de acceso
      const tokenResponse = await exchangeCodeAsync(
        {
          code: result.params.code,
          clientId: Platform.OS === 'web' ? CLIENT_ID_WEB : CLIENT_ID_ANDROID,
          redirectUri,
        },
        discovery
      );

      if (!tokenResponse.accessToken) {
        console.error('❌ No se obtuvo accessToken:', tokenResponse);
        Alert.alert('Error', 'Error al obtener token de Google');
        return;
      }

      // 📡 Obtener datos del usuario
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        }
      );

      const profile = await userInfoResponse.json();
      console.log('✅ Perfil Google:', profile);

      // 📤 Enviar al backend
      const respuesta = await fetch(`${API_URL}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          provider_id: profile.id,
          email: profile.email,
          nombre: profile.name,
          foto: profile.picture,
        }),
      });

      const data = await respuesta.json();

      if (data.exito) {
        console.log('✅ Login OAuth exitoso:', data.usuario);
        router.replace({
          pathname: '/welcome',
          params: data.usuario,
        });
      } else {
        Alert.alert('Error', data.mensaje || 'Error al autenticar con Google');
      }
    } catch (error) {
      console.error('❌ Error en loginConGoogle:', error);
      Alert.alert('Error', 'Error al autenticar con Google');
    } finally {
      setCargando(false);
    }
  };

  return { cargando, loginConGoogle };
}
