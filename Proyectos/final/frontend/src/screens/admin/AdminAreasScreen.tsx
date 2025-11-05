// src/screens/admin/AdminAreasScreen.tsx - ✅ CON BÚSQUEDA
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { areasService, usuariosService } from '@/services/data.service';
import { Colors } from '@/constants';
import { Area, Usuario } from '@/types';

const AdminAreasScreen: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasFiltered, setAreasFiltered] = useState<Area[]>([]);
  const [encargados, setEncargados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    responsable_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Filtrar cuando cambie la búsqueda
  useEffect(() => {
    applySearch();
  }, [searchQuery, areas]);

  const loadData = async () => {
    try {
      const [areasData, usuariosData] = await Promise.all([
        areasService.getAll(),
        usuariosService.getAll({ rol: 'encargado', estado_cuenta: 'activo' }),
      ]);
      setAreas(areasData);
      setEncargados(usuariosData.usuarios);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applySearch = () => {
    if (!searchQuery.trim()) {
      setAreasFiltered(areas);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = areas.filter(area =>
      area.nombre.toLowerCase().includes(query) ||
      (area.descripcion && area.descripcion.toLowerCase().includes(query)) ||
      (area.responsable_nombre && area.responsable_nombre.toLowerCase().includes(query))
    );
    setAreasFiltered(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        nombre: area.nombre,
        descripcion: area.descripcion || '',
        responsable_id: area.responsable_id?.toString() || '',
      });
    } else {
      setEditingArea(null);
      setFormData({ nombre: '', descripcion: '', responsable_id: '' });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingArea(null);
    setFormData({ nombre: '', descripcion: '', responsable_id: '' });
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    try {
      const data = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        responsable_id: formData.responsable_id ? parseInt(formData.responsable_id) : undefined,
      };

      if (editingArea) {
        await areasService.update(editingArea.id, data);
        Alert.alert('Éxito', 'Área actualizada');
      } else {
        await areasService.create(data);
        Alert.alert('Éxito', 'Área creada');
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el área');
    }
  };

  const handleDelete = (area: Area) => {
    Alert.alert(
      'Eliminar Área',
      `¿Estás seguro de eliminar "${area.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await areasService.delete(area.id);
              Alert.alert('Éxito', 'Área eliminada');
              loadData();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el área');
            }
          },
        },
      ]
    );
  };

  const renderArea = ({ item }: { item: Area }) => (
    <View style={styles.areaCard}>
      <View style={styles.areaHeader}>
        <View style={styles.areaIcon}>
          <Ionicons name="business" size={24} color={Colors.primary} />
        </View>
        <View style={styles.areaInfo}>
          <Text style={styles.areaNombre}>{item.nombre}</Text>
          {item.descripcion && (
            <Text style={styles.areaDescripcion} numberOfLines={2}>
              {item.descripcion}
            </Text>
          )}
          {item.responsable_nombre && (
            <View style={styles.responsableRow}>
              <Ionicons name="person" size={14} color={Colors.gray} />
              <Text style={styles.responsableText}>{item.responsable_nombre}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.areaStats}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color={Colors.info} />
          <Text style={styles.statText}>{item.total_trabajadores || 0} trabajadores</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="list-outline" size={16} color={Colors.warning} />
          <Text style={styles.statText}>{item.total_actividades || 0} actividades</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Áreas de Trabajo</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción o responsable..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={areasFiltered}
        renderItem={renderArea}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron áreas' : 'No hay áreas'}
            </Text>
          </View>
        }
      />

      {/* Modal Crear/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingArea ? 'Editar Área' : 'Nueva Área'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  placeholder="Ej: Tejido, Corte, Confección"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.descripcion}
                  onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                  placeholder="Descripción del área"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Responsable (Encargado)</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.responsable_id}
                    onValueChange={(value) => setFormData({ ...formData, responsable_id: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sin asignar" value="" />
                    {encargados.map((enc) => (
                      <Picker.Item
                        key={enc.id}
                        label={enc.nombre_completo || enc.usuario}
                        value={enc.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  areaCard: {
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
  areaHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  areaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  areaInfo: {
    flex: 1,
  },
  areaNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  areaDescripcion: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  responsableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  responsableText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
  },
  areaStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.gray,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
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
    height: 80,
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
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray,
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdminAreasScreen;