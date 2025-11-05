// src/screens/supervisor/SupervisorDashboardScreen.tsx - ✅ NAVEGACIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/data.service';
import { Colors, ESTADOS_ACTIVIDAD } from '@/constants';
import { DashboardStats } from '@/types';

const SupervisorDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', onPress: signOut, style: 'destructive' },
    ]);
  };

  // ✅ CORREGIDO: Navegar al Tab "Activities" y luego al stack "CreateActivity"
  const handleCreateActivity = () => {
    navigation.navigate('Activities', {
      screen: 'CreateActivity'
    });
  };

  // ✅ CORREGIDO: Navegar a la lista de actividades dentro del tab
  const handleViewActivities = () => {
    navigation.navigate('Activities', {
      screen: 'SupervisorActivitiesList'
    });
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
        <View>
          <Text style={styles.greeting}>Hola, {user?.nombre_completo || user?.usuario}</Text>
          <Text style={styles.role}>⚙️ Encargado</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Ionicons name="log-out-outline" size={28} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <Ionicons name="list" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats?.misActividades || 0}</Text>
            <Text style={styles.statLabel}>Mis Actividades</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Ionicons name="people" size={32} color={Colors.success} />
            <Text style={styles.statNumber}>{stats?.trabajadoresEnMiArea || 0}</Text>
            <Text style={styles.statLabel}>Trabajadores</Text>
          </View>
        </View>

        {/* Actividades por Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estado de Actividades</Text>
          <View style={styles.card}>
            {stats?.actividadesPorEstado && stats.actividadesPorEstado.length > 0 ? (
              stats.actividadesPorEstado.map((item) => {
                const estadoInfo = ESTADOS_ACTIVIDAD.find((e) => e.value === item.estado);
                return (
                  <View key={item.estado} style={styles.estadoRow}>
                    <View style={styles.estadoInfo}>
                      <View style={[styles.estadoDot, { backgroundColor: estadoInfo?.color || Colors.gray }]} />
                      <Text style={styles.estadoLabel}>{item.estado}</Text>
                    </View>
                    <Text style={styles.estadoCount}>{item.cantidad}</Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No hay actividades</Text>
            )}
          </View>
        </View>

        {/* Quick Actions - ✅ CORREGIDO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleCreateActivity}
            >
              <Ionicons name="add-circle-outline" size={32} color={Colors.primary} />
              <Text style={styles.actionText}>Crear Actividad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewActivities}
            >
              <Ionicons name="list-outline" size={32} color={Colors.success} />
              <Text style={styles.actionText}>Ver Actividades</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.primary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 14,
    color: '#e0f2fe',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
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
  estadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  estadoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  estadoLabel: {
    fontSize: 16,
    color: Colors.dark,
  },
  estadoCount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'center',
  },
});

export default SupervisorDashboardScreen;