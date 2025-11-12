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
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { useAuth } from '../../context/AuthContext';
import { Colors, GOOGLE_CONFIG } from '../../constants';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { signIn, verifyGoogle } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectUri = makeRedirectUri({
    scheme: GOOGLE_CONFIG.scheme,
    path: 'redirect',
  });

  console.log('🔧 Redirect URI generado:', redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CONFIG.webClientId, 
    androidClientId: GOOGLE_CONFIG.androidClientId,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    console.log('📱 Request disponible:', !!request);
    console.log('🔑 Client IDs configurados:', {
      web: GOOGLE_CONFIG.webClientId,
      android: GOOGLE_CONFIG.androidClientId,
    });
  }, [request]);

  useEffect(() => {
    if (response) {
      console.log('📩 Google Response recibido:', response.type);
      
      if (response.type === 'success') {
        handleGoogleSuccess(response);
      } else if (response.type === 'error') {
        console.error('❌ Google OAuth Error:', response.error);
        Alert.alert('Error', 'No se pudo autenticar con Google');
        setGoogleLoading(false);
      } else if (response.type === 'dismiss' || response.type === 'cancel') {
        console.log('ℹ️ Usuario canceló el login de Google');
        setGoogleLoading(false);
      }
    }
  }, [response]);

  const handleGoogleSuccess = async (response: any) => {
    console.log('✅ Google OAuth Success');
    setGoogleLoading(true);

    try {
      const { authentication } = response;

      if (!authentication?.accessToken) {
        throw new Error('No se recibió token de acceso de Google');
      }

      console.log('🔐 Token recibido (primeros 20 chars):', authentication.accessToken.substring(0, 20) + '...');
      console.log('📞 Obteniendo info del usuario de Google...');
      
      // Obtener info del usuario desde Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Error al obtener información de Google');
      }

      const userInfo = await userInfoResponse.json();
      console.log('👤 User Info recibido:', { 
        email: userInfo.email, 
        name: userInfo.name,
        picture: userInfo.picture ? 'present' : 'missing'
      });

      // ✅ Verificar con tu backend
      console.log('📞 Llamando a backend /auth/google/verify...');
      const result = await verifyGoogle(
        userInfo.email,
        userInfo.name,
        userInfo.picture
      );

      console.log('📄 Backend response:', { 
        needsCompletion: result.needsCompletion,
      });

      if (result.needsCompletion) {
        console.log('➡️ Usuario nuevo, navegando a completar registro');
        navigation.navigate('CompleteGoogleRegister', {
          googleData: result.googleData,
        });
      } else {
        console.log('✅ Usuario existente, login exitoso');
        Alert.alert('¡Bienvenido!', 'Inicio de sesión exitoso');
      }
    } catch (error: any) {
      console.error('❌ Error en Google login:', error);
      console.error('Stack:', error.stack);
      Alert.alert('Error', error.message || 'Error al autenticar con Google');
    } finally {
      setGoogleLoading(false);
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
    console.log('\n🚀 === INICIANDO GOOGLE SIGN IN ===');
    console.log('Request disponible:', !!request);
    console.log('Redirect URI:', redirectUri);
    
    if (!request) {
      Alert.alert('Error', 'Google Auth no está listo. Intenta de nuevo.');
      return;
    }

    setGoogleLoading(true);
    try {
      console.log('📱 Llamando a promptAsync...');
      const result = await promptAsync();
      console.log('📩 promptAsync result type:', result?.type);
    } catch (error) {
      console.error('❌ Error al abrir Google:', error);
      Alert.alert('Error', 'No se pudo abrir Google Sign In');
      setGoogleLoading(false);
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

        <View style={styles.form}>
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
  debugInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
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