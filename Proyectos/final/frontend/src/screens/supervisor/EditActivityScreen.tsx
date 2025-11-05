// src/screens/supervisor/EditActivityScreen.tsx
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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { actividadesService } from '@/services/data.service';
import { Colors, PRIORIDADES, ESTADOS_ACTIVIDAD } from '@/constants';
import { Actividad } from '@/types';

const EditActivityScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { actividadId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actividad, setActividad] = useState<Actividad | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'Media' as 'Baja' | 'Media' | 'Alta',
    estado: 'Pendiente' as any,
    progreso_porcentaje: 0,
    fecha_inicio: new Date(),
    fecha_fin_estimada: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState({
    inicio: false,
    fin: false,
  });

  useEffect(() => {
    loadActividad();
  }, []);

  const loadActividad = async () => {
    try {
      const data = await actividadesService.getById(actividadId);
      setActividad(data);
      setFormData({
        titulo: data.titulo,
        descripcion: data.descripcion || '',
        prioridad: data.prioridad,
        estado: data.estado,
        progreso_porcentaje: data.progreso_porcentaje || 0,
        fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : new Date(),
        fecha_fin_estimada: data.fecha_fin_estimada ? new Date(data.fecha_fin_estimada) : new Date(),
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la actividad');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    setSaving(true);
    try {
      await actividadesService.update(actividadId, {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        prioridad: formData.prioridad,
        estado: formData.estado,
        progreso_porcentaje: formData.progreso_porcentaje,
        fecha_inicio: formData.fecha_inicio.toISOString(),
        fecha_fin_estimada: formData.fecha_fin_estimada.toISOString(),
      });

      Alert.alert('¡Éxito!', 'Actividad actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar actividad');
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (type: 'inicio' | 'fin', event: any, selectedDate?: Date) => {
  //  Cerrar el picker en Android
  if (Platform.OS === 'android') {
    setShowDatePicker({ ...showDatePicker, [type]: false });
  }
  
  //  Solo actualizar si el usuario seleccionó una fecha (no canceló)
  if (event.type === 'set' && selectedDate) {
    setFormData({ ...formData, [`fecha_${type}`]: selectedDate });
  }
  
  //  En iOS, cerrar cuando se presione el botón
  if (Platform.OS === 'ios' && event.type === 'dismissed') {
    setShowDatePicker({ ...showDatePicker, [type]: false });
  }
};

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={16} color={Colors.gray} />
            <Text style={styles.infoText}>{actividad?.area_nombre || 'Sin área'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={Colors.gray} />
            <Text style={styles.infoText}>{actividad?.encargado_nombre || 'Sin encargado'}</Text>
          </View>
        </View>

        {/* Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            onChangeText={(text) => setFormData({ ...formData, titulo: text })}
            placeholder="Título de la actividad"
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Detalles..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.estado}
              onValueChange={(value) => setFormData({ ...formData, estado: value })}
              style={styles.picker}
            >
              {ESTADOS_ACTIVIDAD.map((e) => (
                <Picker.Item key={e.value} label={e.label} value={e.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Prioridad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.radioGroup}>
            {PRIORIDADES.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.radioButton,
                  formData.prioridad === p.value && styles.radioButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, prioridad: p.value as 'Baja' | 'Media' | 'Alta' })}
              >
                <View style={styles.radioCircle}>
                  {formData.prioridad === p.value && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Progreso: {formData.progreso_porcentaje}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={formData.progreso_porcentaje}
            onValueChange={(value) => setFormData({ ...formData, progreso_porcentaje: value })}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />
        </View>

        {/* Fechas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Inicio</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ ...showDatePicker, inicio: true })}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.dateText}>
              {formData.fecha_inicio.toLocaleDateString('es-ES')}
            </Text>
          </TouchableOpacity>
          {showDatePicker.inicio && (
            <DateTimePicker
              value={formData.fecha_inicio}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => onDateChange('inicio', e, d)}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha Fin Estimada</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ ...showDatePicker, fin: true })}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.dateText}>
              {formData.fecha_fin_estimada.toLocaleDateString('es-ES')}
            </Text>
          </TouchableOpacity>
          {showDatePicker.fin && (
            <DateTimePicker
              value={formData.fecha_fin_estimada}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => onDateChange('fin', e, d)}
            />
          )}
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() =>
            navigation.navigate('AssignWorkers', { actividadId, areaId: actividad?.area_id })
          }
        >
          <Ionicons name="people-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, { color: Colors.primary }]}>Asignar Trabajadores</Text>
        </TouchableOpacity>
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
  infoCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
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
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#eff6ff',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.dark,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.dark,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
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

export default EditActivityScreen;