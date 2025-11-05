// src/screens/admin/AdminDashboardScreen.tsx
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

const AdminDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
          <Text style={styles.role}>👑 Administrador</Text>
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
            <Ionicons name="people" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats?.totalUsuarios || 0}</Text>
            <Text style={styles.statLabel}>Usuarios</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Ionicons name="business" size={32} color={Colors.success} />
            <Text style={styles.statNumber}>{stats?.totalAreas || 0}</Text>
            <Text style={styles.statLabel}>Áreas</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="list" size={32} color={Colors.warning} />
            <Text style={styles.statNumber}>{stats?.totalActividades || 0}</Text>
            <Text style={styles.statLabel}>Actividades</Text>
          </View>
        </View>

        {/* Actividades por Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Actividades por Estado</Text>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Users')}
            >
              <Ionicons name="people-outline" size={32} color={Colors.primary} />
              <Text style={styles.actionText}>Gestionar Usuarios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Areas')}
            >
              <Ionicons name="business-outline" size={32} color={Colors.success} />
              <Text style={styles.actionText}>Gestionar Áreas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Activities')}
            >
              <Ionicons name="list-outline" size={32} color={Colors.warning} />
              <Text style={styles.actionText}>Ver Actividades</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Requests')}
            >
              <Ionicons name="notifications-outline" size={32} color={Colors.danger} />
              <Text style={styles.actionText}>Solicitudes</Text>
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
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
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
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
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

export default AdminDashboardScreen;