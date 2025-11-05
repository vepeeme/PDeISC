// src/screens/admin/AdminRequestsScreen.tsx
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
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { solicitudesService, areasService } from '@/services/data.service';
import { Colors, DEFAULT_AVATAR } from '@/constants';
import { Solicitud, Area } from '@/types';

const AdminRequestsScreen: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pendiente'>('pendiente');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [areaId, setAreaId] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [solicitudesData, areasData] = await Promise.all([
        solicitudesService.getAll(filter === 'all' ? undefined : 'pendiente'),
        areasService.getAll(),
      ]);
      setSolicitudes(solicitudesData.solicitudes);
      setAreas(areasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpenModal = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setAreaId(solicitud.area_solicitada_id?.toString() || '');
    setComentario('');
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSolicitud(null);
    setAreaId('');
    setComentario('');
  };

  const handleAprobar = async () => {
    if (!selectedSolicitud) return;

    try {
      await solicitudesService.aprobar(selectedSolicitud.id, {
        area_id: areaId ? parseInt(areaId) : undefined,
        comentario: comentario.trim() || undefined,
      });
      Alert.alert('Éxito', 'Solicitud aprobada');
      handleCloseModal();
      loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo aprobar la solicitud');
    }
  };

  const handleRechazar = (solicitud: Solicitud) => {
    Alert.alert(
      'Rechazar Solicitud',
      `¿Estás seguro de rechazar la solicitud de ${solicitud.nombre_completo || solicitud.usuario}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => {
            // Mostrar input para comentario opcional
            Alert.prompt(
              'Motivo del rechazo (opcional)',
              'Explica el motivo del rechazo',
              async (text) => {
                try {
                  await solicitudesService.rechazar(solicitud.id, text);
                  Alert.alert('Éxito', 'Solicitud rechazada y usuario eliminado');
                  loadData();
                } catch (error) {
                  Alert.alert('Error', 'No se pudo rechazar la solicitud');
                }
              },
              'plain-text'
            );
          },
        },
      ]
    );
  };

  const renderSolicitud = ({ item }: { item: Solicitud }) => (
    <View style={styles.solicitudCard}>
      <View style={styles.solicitudHeader}>
        <Image source={{ uri: item.foto_perfil || DEFAULT_AVATAR }} style={styles.avatar} />
        <View style={styles.solicitudInfo}>
          <Text style={styles.nombre}>{item.nombre_completo || item.usuario}</Text>
          <Text style={styles.email}>{item.email}</Text>
          {item.telefono && <Text style={styles.telefono}>📞 {item.telefono}</Text>}
        </View>
      </View>

      {item.area_solicitada_nombre && (
        <View style={styles.areaRow}>
          <Ionicons name="business" size={16} color={Colors.info} />
          <Text style={styles.areaText}>Área solicitada: {item.area_solicitada_nombre}</Text>
        </View>
      )}

      {item.motivo && (
        <View style={styles.motivoContainer}>
          <Text style={styles.motivoLabel}>Motivo:</Text>
          <Text style={styles.motivoText}>{item.motivo}</Text>
        </View>
      )}

      <View style={styles.metaInfo}>
        <View style={[styles.estadoBadge, getEstadoBadgeStyle(item.estado)]}>
          <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
        </View>
        <Text style={styles.fecha}>
          {new Date(item.creado_en).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      {item.estado === 'pendiente' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.aprobarButton} onPress={() => handleOpenModal(item)}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechazarButton} onPress={() => handleRechazar(item)}>
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.estado !== 'pendiente' && (
        <View style={styles.revisionInfo}>
          <Text style={styles.revisionLabel}>Revisado por:</Text>
          <Text style={styles.revisionText}>{item.revisado_por_nombre || 'Administrador'}</Text>
          {item.comentario_revision && (
            <Text style={styles.comentarioRevision}>{item.comentario_revision}</Text>
          )}
        </View>
      )}
    </View>
  );

  const getEstadoBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { backgroundColor: '#fef3c7', borderColor: Colors.warning };
      case 'aprobada':
        return { backgroundColor: '#f0fdf4', borderColor: Colors.success };
      case 'rechazada':
        return { backgroundColor: '#fee2e2', borderColor: Colors.danger };
      default:
        return { backgroundColor: Colors.background, borderColor: Colors.border };
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitudes de Encargado</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {(['pendiente', 'all'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[styles.filterText, filter === filterType && styles.filterTextActive]}>
              {filterType === 'pendiente' ? 'Pendientes' : 'Todas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={solicitudes}
        renderItem={renderSolicitud}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>No hay solicitudes</Text>
          </View>
        }
      />

      {/* Modal Aprobar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aprobar Solicitud</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalInfo}>
                Aprobando solicitud de: {selectedSolicitud?.nombre_completo || selectedSolicitud?.usuario}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Área a Asignar</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={areaId}
                    onValueChange={(value) => setAreaId(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Seleccionar área" value="" />
                    {areas.map((area) => (
                      <Picker.Item key={area.id} label={area.nombre} value={area.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Comentario (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={comentario}
                  onChangeText={setComentario}
                  placeholder="Mensaje para el nuevo encargado..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAprobar}>
                <Text style={styles.confirmButtonText}>Aprobar</Text>
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
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.gray,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  solicitudCard: {
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
  solicitudHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  solicitudInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  email: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  telefono: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  areaText: {
    fontSize: 13,
    color: Colors.info,
    fontWeight: '500',
  },
  motivoContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 6,
  },
  motivoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 4,
  },
  motivoText: {
    fontSize: 14,
    color: Colors.dark,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fecha: {
    fontSize: 12,
    color: Colors.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  aprobarButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.success,
    padding: 12,
    borderRadius: 8,
  },
  rechazarButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.danger,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  revisionInfo: {
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 6,
  },
  revisionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 4,
  },
  revisionText: {
    fontSize: 14,
    color: Colors.dark,
  },
  comentarioRevision: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
    fontStyle: 'italic',
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
  modalInfo: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
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
  input: {
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
    textAlignVertical: 'top',
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
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdminRequestsScreen;