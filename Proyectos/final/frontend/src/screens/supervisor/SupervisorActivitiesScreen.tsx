// src/screens/supervisor/SupervisorActivitiesScreen.tsx
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { actividadesService } from '@/services/data.service';
import { Colors, ESTADOS_ACTIVIDAD, PRIORIDADES } from '@/constants';
import { Actividad } from '@/types';

const SupervisorActivitiesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadActividades();
  }, [filter]);

  const loadActividades = async () => {
    try {
      const params = filter !== 'all' ? { estado: filter } : undefined;
      const response = await actividadesService.getAll(params);
      setActividades(response.actividades);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las actividades');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadActividades();
  };

  const getEstadoColor = (estado: string) => {
    const estadoInfo = ESTADOS_ACTIVIDAD.find((e) => e.value === estado);
    return estadoInfo?.color || Colors.gray;
  };

  const getPrioridadColor = (prioridad: string) => {
    const prioridadInfo = PRIORIDADES.find((p) => p.value === prioridad);
    return prioridadInfo?.color || Colors.gray;
  };

  const renderActividad = ({ item }: { item: Actividad }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetail', { actividadId: item.id })}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditActivity', { actividadId: item.id })}
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {item.descripcion && (
        <Text style={styles.activityDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
      )}

      <View style={styles.activityMeta}>
        <View style={styles.metaRow}>
          <Ionicons name="business-outline" size={14} color={Colors.gray} />
          <Text style={styles.metaText}>{item.area_nombre || 'Sin área'}</Text>
        </View>
      </View>

      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
          <Text style={[styles.badgeText, { color: getEstadoColor(item.estado) }]}>
            {item.estado}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getPrioridadColor(item.prioridad) + '20' }]}>
          <Text style={[styles.badgeText, { color: getPrioridadColor(item.prioridad) }]}>
            {item.prioridad}
          </Text>
        </View>
        {item.total_trabajadores !== undefined && item.total_trabajadores > 0 && (
          <View style={styles.trabajadoresBadge}>
            <Ionicons name="people" size={12} color={Colors.info} />
            <Text style={styles.trabajadoresText}>{item.total_trabajadores}</Text>
          </View>
        )}
      </View>

      {item.progreso_porcentaje !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progreso_porcentaje}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progreso_porcentaje}%</Text>
        </View>
      )}
    </TouchableOpacity>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>

        {ESTADOS_ACTIVIDAD.map((estado) => (
          <TouchableOpacity
            key={estado.value}
            style={[styles.filterButton, filter === estado.value && styles.filterButtonActive]}
            onPress={() => setFilter(estado.value)}
          >
            <Text style={[styles.filterText, filter === estado.value && styles.filterTextActive]}>
              {estado.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB - Crear Actividad */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateActivity')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={actividades}
        renderItem={renderActividad}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>No hay actividades</Text>
          </View>
        }
      />
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
  filtersScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.gray,
    whiteSpace: 'nowrap',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 12,
  },
  activityMeta: {
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.gray,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trabajadoresBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
  },
  trabajadoresText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.info,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
    minWidth: 40,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
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
});

export default SupervisorActivitiesScreen;