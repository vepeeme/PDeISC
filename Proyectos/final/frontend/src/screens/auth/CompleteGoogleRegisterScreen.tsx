// src/screens/auth/CompleteGoogleRegisterScreen.tsx
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
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { areasService } from '@/services/data.service';
import { Colors } from '@/constants';
import { Area } from '@/types';

const CompleteGoogleRegisterScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { completeGoogleRegister } = useAuth();
  const { googleData } = route.params;

  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  const [formData, setFormData] = useState({
    rol: 'trabajador' as 'trabajador' | 'encargado',
    area_id: '',
    puesto: '',
    motivo: '',
  });

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

  const handleComplete = async () => {
    // Validaciones
    if (formData.rol === 'trabajador' && !formData.area_id) {
      Alert.alert('Error', 'Selecciona un área');
      return;
    }

    if (formData.rol === 'encargado' && !formData.motivo.trim()) {
      Alert.alert('Error', 'Indica el motivo de tu solicitud');
      return;
    }

    setLoading(true);
    try {
      const result = await completeGoogleRegister({
        email: googleData.email,
        nombre: googleData.nombre,
        foto: googleData.foto,
        rol: formData.rol,
        area_id: formData.area_id ? parseInt(formData.area_id) : undefined,
        puesto: formData.puesto.trim() || undefined,
        motivo: formData.motivo.trim() || undefined,
      });

      if (result.isPending) {
        Alert.alert(
          '¡Solicitud Enviada!',
          result.mensaje || 'Tu solicitud está pendiente de aprobación.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        // Ya está autenticado (trabajador)
        Alert.alert('¡Éxito!', result.mensaje || 'Registro completado. Bienvenido.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al completar registro');
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
          <Text style={styles.title}>Completa tu Registro</Text>
          <Text style={styles.subtitle}>Solo un paso más</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          {googleData.foto && (
            <Image source={{ uri: googleData.foto }} style={styles.avatar} />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{googleData.nombre}</Text>
            <Text style={styles.userEmail}>{googleData.email}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Rol */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ¿Cómo deseas registrarte? <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, formData.rol === 'trabajador' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, rol: 'trabajador' })}
              >
                <View style={styles.radioCircle}>
                  {formData.rol === 'trabajador' && <View style={styles.radioCircleInner} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioLabel}>Trabajador</Text>
                  <Text style={styles.radioDescription}>Acceso inmediato</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, formData.rol === 'encargado' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, rol: 'encargado' })}
              >
                <View style={styles.radioCircle}>
                  {formData.rol === 'encargado' && <View style={styles.radioCircleInner} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioLabel}>Encargado</Text>
                  <Text style={styles.radioDescription}>Requiere aprobación</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Área (para trabajador) */}
          {formData.rol === 'trabajador' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Área <Text style={styles.required}>*</Text>
                </Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Puesto</Text>
                <TextInput
                  style={styles.input}
                  value={formData.puesto}
                  onChangeText={(text) => setFormData({ ...formData, puesto: text })}
                  placeholder="Ej: Operario, Ayudante"
                />
              </View>
            </>
          )}

          {/* Área y Motivo (para encargado) */}
          {formData.rol === 'encargado' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Área a Encargarse</Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Motivo de la Solicitud <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.motivo}
                  onChangeText={(text) => setFormData({ ...formData, motivo: text })}
                  placeholder="¿Por qué deseas ser encargado?"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={Colors.info} />
                <Text style={styles.infoText}>
                  Tu solicitud será revisada por un administrador antes de darte acceso.
                </Text>
              </View>
            </>
          )}

          {/* Complete Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Completar Registro</Text>
            )}
          </TouchableOpacity>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
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
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#eff6ff',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  radioDescription: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
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
  textArea: {
    height: 100,
    paddingTop: 12,
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.info,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompleteGoogleRegisterScreen;