// src/screens/shared/ActivityDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { actividadesService } from '@/services/data.service';
import { Colors, ESTADOS_ACTIVIDAD, PRIORIDADES, DEFAULT_AVATAR } from '@/constants';
import { Actividad, Comentario } from '@/types';

const ActivityDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { actividadId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [actividadData, comentariosData] = await Promise.all([
        actividadesService.getById(actividadId),
        actividadesService.getComentarios(actividadId),
      ]);
      setActividad(actividadData);
      setComentarios(comentariosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la actividad');
      navigation.goBack();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleMarcarCompletada = () => {
  Alert.alert('Confirmar', '¿Marcar esta actividad como completada?', [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: 'Confirmar',
      onPress: async () => {
        try {
          // ✅ Usar el nuevo método específico para trabajadores
          await actividadesService.completarActividad(actividadId);
          Alert.alert('¡Éxito!', 'Actividad marcada como completada', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Error al marcar como completada');
        }
      },
    },
  ]);
};

  const handleEnviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    setEnviandoComentario(true);
    try {
      await actividadesService.agregarComentario(actividadId, nuevoComentario.trim());
      setNuevoComentario('');
      await loadData(); // Recargar comentarios
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const estadoInfo = ESTADOS_ACTIVIDAD.find((e) => e.value === estado);
    return estadoInfo?.color || Colors.gray;
  };

  const getPrioridadColor = (prioridad: string) => {
    const prioridadInfo = PRIORIDADES.find((p) => p.value === prioridad);
    return prioridadInfo?.color || Colors.gray;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!actividad) return null;

  const canEdit = user?.rol === 'admin' || user?.rol === 'encargado';
  const canComplete =
    user?.rol === 'trabajador' &&
    actividad.estado !== 'Finalizada' &&
    actividad.estado !== 'Cancelada';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>{actividad.titulo}</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getEstadoColor(actividad.estado) + '20' }]}>
              <Text style={[styles.badgeText, { color: getEstadoColor(actividad.estado) }]}>
                {actividad.estado}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getPrioridadColor(actividad.prioridad) + '20' }]}>
              <Text style={[styles.badgeText, { color: getPrioridadColor(actividad.prioridad) }]}>
                {actividad.prioridad}
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        {actividad.descripcion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Descripción</Text>
            <View style={styles.card}>
              <Text style={styles.description}>{actividad.descripcion}</Text>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Información</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={18} color={Colors.gray} />
              <Text style={styles.infoLabel}>Área:</Text>
              <Text style={styles.infoValue}>{actividad.area_nombre || 'N/A'}</Text>
            </View>
            {actividad.encargado_nombre && (
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color={Colors.gray} />
                <Text style={styles.infoLabel}>Encargado:</Text>
                <Text style={styles.infoValue}>{actividad.encargado_nombre}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.gray} />
              <Text style={styles.infoLabel}>Inicio:</Text>
              <Text style={styles.infoValue}>
                {actividad.fecha_inicio
                  ? new Date(actividad.fecha_inicio).toLocaleDateString('es-ES')
                  : 'N/A'}
              </Text>
            </View>
            {actividad.fecha_fin_estimada && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.gray} />
                <Text style={styles.infoLabel}>Fin estimado:</Text>
                <Text style={styles.infoValue}>
                  {new Date(actividad.fecha_fin_estimada).toLocaleDateString('es-ES')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Progreso</Text>
          <View style={styles.card}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${actividad.progreso_porcentaje}%` }]} />
              </View>
              <Text style={styles.progressText}>{actividad.progreso_porcentaje}%</Text>
            </View>
          </View>
        </View>

        {/* Trabajadores */}
        {actividad.trabajadores && actividad.trabajadores.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Trabajadores Asignados</Text>
            <View style={styles.card}>
              {actividad.trabajadores.map((trabajador) => (
                <View key={trabajador.id} style={styles.trabajadorRow}>
                  <Image
                    source={{ uri: trabajador.foto_perfil || DEFAULT_AVATAR }}
                    style={styles.trabajadorAvatar}
                  />
                  <View style={styles.trabajadorInfo}>
                    <Text style={styles.trabajadorNombre}>{trabajador.nombre_completo}</Text>
                    <Text style={styles.trabajadorRol}>{trabajador.rol_en_actividad}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Comentarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Comentarios ({comentarios.length})</Text>
          <View style={styles.card}>
            {comentarios.length > 0 ? (
              comentarios.map((comentario) => (
                <View key={comentario.id} style={styles.comentarioItem}>
                  <Image
                    source={{ uri: comentario.usuario_foto || DEFAULT_AVATAR }}
                    style={styles.comentarioAvatar}
                  />
                  <View style={styles.comentarioContent}>
                    <Text style={styles.comentarioNombre}>{comentario.usuario_nombre}</Text>
                    <Text style={styles.comentarioMensaje}>{comentario.mensaje}</Text>
                    <Text style={styles.comentarioFecha}>
                      {new Date(comentario.creado_en).toLocaleString('es-ES')}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No hay comentarios</Text>
            )}
          </View>

          {/* Agregar Comentario */}
          <View style={styles.comentarioInput}>
            <TextInput
              style={styles.input}
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
              placeholder="Escribe un comentario..."
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, enviandoComentario && styles.sendButtonDisabled]}
              onPress={handleEnviarComentario}
              disabled={enviandoComentario || !nuevoComentario.trim()}
            >
              {enviandoComentario ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actions}>
          {canComplete && (
            <TouchableOpacity style={styles.actionButton} onPress={handleMarcarCompletada}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Marcar como Completada</Text>
            </TouchableOpacity>
          )}

          {canEdit && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('EditActivity', { actividadId })}
            >
              <Ionicons name="create-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.actionButtonText, { color: Colors.primary }]}>Editar Actividad</Text>
            </TouchableOpacity>
          )}
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
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: Colors.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: Colors.dark,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.dark,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    minWidth: 50,
    textAlign: 'right',
  },
  trabajadorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trabajadorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  trabajadorInfo: {
    flex: 1,
  },
  trabajadorNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  trabajadorRol: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  comentarioItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  comentarioAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  comentarioContent: {
    flex: 1,
  },
  comentarioNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  comentarioMensaje: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 4,
  },
  comentarioFecha: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 14,
  },
  comentarioInput: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: Colors.background,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityDetailScreen;