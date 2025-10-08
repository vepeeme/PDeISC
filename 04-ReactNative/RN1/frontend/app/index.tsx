import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const [esRegistro, setEsRegistro] = useState(false);
  const { registro, login, cargando, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (usuario: string, password: string) => {
    if (esRegistro) {
      const resultado = await registro(usuario, password);
      
      if (resultado && resultado.exito) {
        Alert.alert(
          'Éxito',
          'Usuario registrado exitosamente. Ahora puedes iniciar sesión.',
          [{ text: 'OK', onPress: () => setEsRegistro(false) }]
        );
      }
    } else {
      const resultado = await login(usuario, password);
      
      if (resultado && resultado.exito && resultado.usuario) {
        router.push({
          pathname: '/welcome',
          params: {
            id: resultado.usuario.id.toString(),
            usuario: resultado.usuario.usuario,
            creado_en: resultado.usuario.creado_en || '',
          },
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <AuthForm
            onSubmit={handleSubmit}
            cargando={cargando}
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
});