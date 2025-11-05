// src/screens/auth/RegisterWorkerScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { areasService } from '@/services/data.service';
import { Colors } from '@/constants';
import { Area } from '@/types';

const RegisterWorkerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { registerWorker } = useAuth();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    confirmPassword: '',
    email: '',
    nombre_completo: '',
    telefono: '',
    area_id: '',
    puesto: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const areasData = await areasService.getPublicas();
      setAreas(areasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las áreas');
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleRegister = async () => {
    // Validaciones
    if (!formData.usuario.trim() || !formData.password || !formData.email.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'El email no es válido');
      return;
    }

    setLoading(true);
    try {
      await registerWorker({
        usuario: formData.usuario.trim(),
        password: formData.password,
        email: formData.email.trim(),
        nombre_completo: formData.nombre_completo.trim() || undefined,
        telefono: formData.telefono.trim() || undefined,
        area_id: formData.area_id ? parseInt(formData.area_id) : undefined,
        puesto: formData.puesto.trim() || undefined,
      });

      Alert.alert('¡Éxito!', 'Registro completado. Bienvenido.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAreas) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Registro Trabajador</Text>
          <Text style={styles.subtitle}>Completa tus datos para crear tu cuenta</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Usuario */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Usuario <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.usuario}
              onChangeText={(text) => setFormData({ ...formData, usuario: text })}
              placeholder="Ej: juan123"
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Contraseña <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirmar Contraseña <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Repite tu contraseña"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nombre Completo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre_completo}
              onChangeText={(text) => setFormData({ ...formData, nombre_completo: text })}
              placeholder="Ej: Juan Pérez"
            />
          </View>

          {/* Teléfono */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.telefono}
              onChangeText={(text) => setFormData({ ...formData, telefono: text })}
              placeholder="Ej: 1234567890"
              keyboardType="phone-pad"
            />
          </View>

          {/* Área */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Área</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.area_id}
                onValueChange={(value) => setFormData({ ...formData, area_id: value })}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un área" value="" />
                {areas.map((area) => (
                  <Picker.Item key={area.id} label={area.nombre} value={area.id.toString()} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Puesto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Puesto</Text>
            <TextInput
              style={styles.input}
              value={formData.puesto}
              onChangeText={(text) => setFormData({ ...formData, puesto: text })}
              placeholder="Ej: Operario, Ayudante"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarme</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: Colors.gray,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default RegisterWorkerScreen;