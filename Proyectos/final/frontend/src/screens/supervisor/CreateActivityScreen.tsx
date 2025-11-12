// src/screens/supervisor/CreateActivityScreen.tsx
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { areasService, actividadesService } from '@/services/data.service';
import { Colors, PRIORIDADES } from '@/constants';
import { Area } from '@/types';

const CreateActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    area_id: '',
    prioridad: 'Media' as 'Baja' | 'Media' | 'Alta',
    fecha_inicio: new Date(),
    fecha_fin_estimada: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState({
    inicio: false,
    fin: false,
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const areasData = await areasService.getAll();
      setAreas(areasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las áreas');
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (!formData.area_id) {
      Alert.alert('Error', 'Selecciona un área');
      return;
    }

    if (formData.fecha_fin_estimada < formData.fecha_inicio) {
      Alert.alert('Error', 'La fecha de fin no puede ser anterior a la de inicio');
      return;
    }

    setLoading(true);
    try {
      await actividadesService.create({
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        area_id: parseInt(formData.area_id),
        prioridad: formData.prioridad,
        fecha_inicio: formData.fecha_inicio.toISOString(),
        fecha_fin_estimada: formData.fecha_fin_estimada.toISOString(),
      });

      Alert.alert('¡Éxito!', 'Actividad creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear actividad');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (type: 'inicio' | 'fin', event: any, selectedDate?: Date) => {
    setShowDatePicker({ inicio: false, fin: false });

    // Solo actualizar si el usuario presionó OK (no CANCEL)
    if (event.type === 'set' && selectedDate) {
      if (type === 'inicio') {
        setFormData({ ...formData, fecha_inicio: selectedDate });
      } else {
        setFormData({ ...formData, fecha_fin_estimada: selectedDate });
      }
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
        {/* Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            onChangeText={(text) => setFormData({ ...formData, titulo: text })}
            placeholder="Ej: Corte de tela para lote 123"
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Detalles de la actividad..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Área */}
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

        {/* Fecha de Inicio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Inicio</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ inicio: true, fin: false })}
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
              display="default"
              onChange={(e, d) => onDateChange('inicio', e, d)}
            />
          )}
        </View>

        {/* Fecha Fin Estimada */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha Fin Estimada</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker({ inicio: false, fin: true })}
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
              display="default"
              onChange={(e, d) => onDateChange('fin', e, d)}
            />
          )}
        </View>

        {/* Botón Crear */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Crear Actividad</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.dark, marginBottom: 8 },
  required: { color: Colors.danger },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  textArea: { height: 100, paddingTop: 12 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  picker: { height: 50 },
  radioGroup: { flexDirection: 'row', gap: 12 },
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
  radioButtonActive: { borderColor: Colors.primary, backgroundColor: '#eff6ff' },
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
  radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  radioLabel: { fontSize: 14, color: Colors.dark },
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
  dateText: { marginLeft: 12, fontSize: 16, color: Colors.dark },
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CreateActivityScreen;