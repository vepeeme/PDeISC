// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { Colors } from '../../constants';
import type { ResponseType } from 'expo-auth-session';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { signIn, verifyGoogle } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Auth
  const { request, response, promptAsync } = authService.useGoogleAuth();

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === 'success') {
      setGoogleLoading(true);
      try {
        const { authentication } = response;
        if (authentication?.accessToken) {
          const userInfo = await authService.getGoogleUserInfo(authentication.accessToken);
          
          const result = await verifyGoogle(userInfo.email, userInfo.name, userInfo.picture);
          
          if (result.needsCompletion) {
            // Usuario nuevo, completar registro
            navigation.navigate('CompleteGoogleRegister', {
              googleData: result.googleData,
            });
          }
          // Si no necesita completar, ya se autenticó automáticamente
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Error al autenticar con Google');
      } finally {
        setGoogleLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signIn({ usuario, password });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="business" size={60} color={Colors.primary} />
          <Text style={styles.title}>Fábrica Textil</Text>
          <Text style={styles.subtitle}>Gestión de Actividades</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Usuario */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Usuario o email"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            style={[styles.googleButton, (googleLoading || !request) && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading || !request}
          >
            {googleLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register Links */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterWorker')}>
              <Text style={styles.registerLink}>Registrarme como Trabajador</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterSupervisor')}>
              <Text style={styles.registerLink}>Registrarme como Encargado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.dark,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.gray,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  registerText: {
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 8,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default LoginScreen;