// frontend/components/AuthForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthFormProps {
  onSubmit: (usuario: string, password: string) => void;
  onGoogleLogin?: () => void;
  cargando: boolean;
  error: string | null;
  info?: string | null;
  esRegistro: boolean;
  onCambiarModo: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  onGoogleLogin,
  cargando,
  error,
  info,
  esRegistro,
  onCambiarModo,
}) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    setLocalError(null);
    if (!usuario.trim() || !password.trim()) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    onSubmit(usuario.trim(), password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name={esRegistro ? "person-add" : "log-in"} 
          size={50} 
          color="#007AFF" 
        />
        <Text style={styles.titulo}>
          {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>
        <Text style={styles.subtitulo}>
          {esRegistro 
            ? 'Completa los datos para registrarte' 
            : 'Ingresa tus credenciales para continuar'}
        </Text>
      </View>

      {/* Mensaje de éxito/info */}
      {info && (
        <View style={styles.infoContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#2e7d32" />
          <Text style={styles.infoText}>{info}</Text>
        </View>
      )}

      {/* Error (backend) o error local de validación */}
      {(localError || error) && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#c62828" />
          <Text style={styles.errorText}>{localError || error}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            editable={!cargando}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!cargando}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.boton, cargando && styles.botonDeshabilitado]}
        onPress={handleSubmit}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons 
              name={esRegistro ? "person-add" : "log-in"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.botonTexto}>
              {esRegistro ? 'Registrarse' : 'Ingresar'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {!esRegistro && onGoogleLogin && (
        <>
          <View style={styles.separador}>
            <View style={styles.lineaSeparador} />
            <Text style={styles.textoSeparador}>O continúa con</Text>
            <View style={styles.lineaSeparador} />
          </View>

          <TouchableOpacity
            style={styles.botonGoogle}
            onPress={onGoogleLogin}
            disabled={cargando}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text style={styles.textoBotonGoogle}>Continuar con Google</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.cambiarModo}
        onPress={onCambiarModo}
        disabled={cargando}
      >
        <Text style={styles.cambiarModoTexto}>
          {esRegistro
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* styles (idénticos al anterior, + estilos para infoContainer) */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  boton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  botonDeshabilitado: {
    backgroundColor: '#999',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cambiarModo: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  cambiarModoTexto: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: '#c62828',
    fontSize: 14,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#2e7d32',
    fontSize: 14,
    lineHeight: 20,
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  lineaSeparador: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  textoSeparador: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  botonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DB4437',
    gap: 10,
  },
  textoBotonGoogle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
