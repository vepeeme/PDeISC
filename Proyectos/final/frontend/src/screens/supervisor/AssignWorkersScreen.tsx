// src/screens/supervisor/AssignWorkersScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usuariosService, actividadesService } from '@/services/data.service';
import { Colors, DEFAULT_AVATAR } from '@/constants';
import { Usuario } from '@/types';

interface TrabajadorSeleccionado {
  trabajador_id: number;
  rol_en_actividad: string;
}

const AssignWorkersScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { actividadId, areaId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trabajadores, setTrabajadores] = useState<Usuario[]>([]);
  const [selected, setSelected] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    loadTrabajadores();
    loadAsignados();
  }, []);

  const loadTrabajadores = async () => {
    try {
      const data = await usuariosService.getTrabajadoresPorArea(areaId);
      setTrabajadores(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los trabajadores');
    } finally {
      setLoading(false);
    }
  };

  const loadAsignados = async () => {
    try {
      const actividad = await actividadesService.getById(actividadId);
      if (actividad.trabajadores) {
        const newSelected = new Map<number, string>();
        actividad.trabajadores.forEach((t) => {
          newSelected.set(t.id, t.rol_en_actividad);
        });
        setSelected(newSelected);
      }
    } catch (error) {
      console.error('Error al cargar asignados:', error);
    }
  };

  const toggleWorker = (id: number) => {
    const newSelected = new Map(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.set(id, 'Operario');
    }
    setSelected(newSelected);
  };

  const updateRole = (id: number, role: string) => {
    const newSelected = new Map(selected);
    if (newSelected.has(id)) {
      newSelected.set(id, role);
      setSelected(newSelected);
    }
  };

  const handleSave = async () => {
    if (selected.size === 0) {
      Alert.alert('Advertencia', 'No has seleccionado ningún trabajador');
      return;
    }

    setSaving(true);
    try {
      const trabajadores: TrabajadorSeleccionado[] = Array.from(selected.entries()).map(
        ([trabajador_id, rol_en_actividad]) => ({
          trabajador_id,
          rol_en_actividad,
        })
      );

      await actividadesService.asignarTrabajadores(actividadId, trabajadores);

      Alert.alert('¡Éxito!', 'Trabajadores asignados correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al asignar trabajadores');
    } finally {
      setSaving(false);
    }
  };

  const renderTrabajador = ({ item }: { item: Usuario }) => {
    const isSelected = selected.has(item.id);
    const role = selected.get(item.id) || 'Operario';

    return (
      <View style={styles.workerCard}>
        <TouchableOpacity
          style={styles.workerMain}
          onPress={() => toggleWorker(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Image
            source={{ uri: item.foto_perfil || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{item.nombre_completo || item.usuario}</Text>
            <Text style={styles.workerEmail}>{item.email}</Text>
            {item.puesto && <Text style={styles.workerPuesto}>{item.puesto}</Text>}
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Rol en actividad:</Text>
            <TextInput
              style={styles.roleInput}
              value={role}
              onChangeText={(text) => updateRole(item.id, text)}
              placeholder="Ej: Operario, Ayudante"
            />
          </View>
        )}
      </View>
    );
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
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {selected.size} trabajador{selected.size !== 1 ? 'es' : ''} seleccionado
          {selected.size !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={trabajadores}
        renderItem={renderTrabajador}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>No hay trabajadores en esta área</Text>
          </View>
        }
      />

      {/* Botón Guardar */}
      {selected.size > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Guardar Asignación</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  list: {
    padding: 16,
  },
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  workerEmail: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  workerPuesto: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  roleContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  roleInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fff',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssignWorkersScreen;