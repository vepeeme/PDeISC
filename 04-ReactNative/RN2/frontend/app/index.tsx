// frontend/app/index.tsx
import React, { useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthForm } from '../components/AuthForm';
import { useOAuth } from '../hooks/useOAuth';

const API_URL = 'http://localhost:5000'; // ⚠️ Cambiar si tu backend está en otro host

export default function Index() {
  const router = useRouter();
  const [cargandoLocal, setCargandoLocal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esRegistro, setEsRegistro] = useState(false);

  const { cargando, loginConGoogle } = useOAuth();

  const handleAuth = async (usuario: string, password: string) => {
    try {
      setCargandoLocal(true);
      setError(null);

      const endpoint = esRegistro ? '/auth/registro' : '/auth/login';

      const respuesta = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await respuesta.json();

      if (data.exito) {
        router.replace({
          pathname: '/welcome',
          params: data.usuario,
        });
      } else {
        setError(data.mensaje || 'Error al autenticar usuario');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setCargandoLocal(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formWrapper}>
          <AuthForm
            onSubmit={handleAuth}
            onGoogleLogin={loginConGoogle}
            cargando={cargando || cargandoLocal}
            error={error}
            esRegistro={esRegistro}
            onCambiarModo={() => setEsRegistro(!esRegistro)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
});
