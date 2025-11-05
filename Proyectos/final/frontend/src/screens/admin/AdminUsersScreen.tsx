// src/screens/admin/AdminUsersScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usuariosService } from '@/services/data.service';
import { Colors, ROLES_LABELS, DEFAULT_AVATAR } from '@/constants';
import { Usuario } from '@/types';

const AdminUsersScreen: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'admin' | 'encargado' | 'trabajador'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsuarios();
  }, [filter, searchQuery]);

  const loadUsuarios = async () => {
    try {
      const params: any = filter !== 'all' ? { rol: filter } : {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const response = await usuariosService.getAll(params);
      setUsuarios(response.usuarios);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsuarios();
  };

  const handleDeleteUser = (usuario: Usuario) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de eliminar a ${usuario.nombre_completo || usuario.usuario}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await usuariosService.delete(usuario.id);
              Alert.alert('Éxito', 'Usuario eliminado');
              loadUsuarios();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const handleToggleEstado = async (usuario: Usuario) => {
    const nuevoEstado = usuario.estado_cuenta === 'activo' ? 'suspendido' : 'activo';
    try {
      await usuariosService.updateEstado(usuario.id, nuevoEstado);
      Alert.alert('Éxito', `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'suspendido'}`);
      loadUsuarios();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <View style={styles.userCard}>
      <Image
        source={{ uri: item.foto_perfil || DEFAULT_AVATAR }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nombre_completo || item.usuario}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <View style={[styles.badge, getBadgeColor(item.rol)]}>
            <Text style={styles.badgeText}>{ROLES_LABELS[item.rol]}</Text>
          </View>
          <View style={[styles.badge, item.estado_cuenta === 'activo' ? styles.badgeActive : styles.badgeSuspended]}>
            <Text style={styles.badgeText}>{item.estado_cuenta}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleToggleEstado(item)} style={styles.actionButton}>
          <Ionicons
            name={item.estado_cuenta === 'activo' ? 'lock-closed' : 'lock-open'}
            size={20}
            color={Colors.warning}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item)} style={styles.actionButton}>
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
      {/*  HEADER AZUL */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
      </View>

      {/*  BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, usuario o email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/*  FILTROS CON SCROLL HORIZONTAL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'admin', 'encargado', 'trabajador'] as const).map((rol) => (
          <TouchableOpacity
            key={rol}
            style={[styles.filterButton, filter === rol && styles.filterButtonActive]}
            onPress={() => setFilter(rol)}
          >
            <Text style={[styles.filterText, filter === rol && styles.filterTextActive]}>
              {rol === 'all' ? 'Todos' : ROLES_LABELS[rol]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        }
      />
    </View>
  );
};

const getBadgeColor = (rol: string) => {
  switch (rol) {
    case 'admin':
      return { backgroundColor: '#fef3c7', borderColor: Colors.warning };
    case 'encargado':
      return { backgroundColor: '#e0f2fe', borderColor: Colors.primary };
    case 'trabajador':
      return { backgroundColor: '#f0fdf4', borderColor: Colors.success };
    default:
      return { backgroundColor: Colors.background, borderColor: Colors.border };
  }
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: '#f0fdf4',
    borderColor: Colors.success,
  },
  badgeSuspended: {
    backgroundColor: '#fee2e2',
    borderColor: Colors.danger,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
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
});

export default AdminUsersScreen;