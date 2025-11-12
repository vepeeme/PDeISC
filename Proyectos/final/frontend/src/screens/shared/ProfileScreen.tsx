// src/screens/shared/ProfileScreen.tsx
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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { usuariosService } from '@/services/data.service';
import { Colors, ROLES_LABELS, DEFAULT_AVATAR } from '@/constants';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, refreshUser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombre_completo: user?.nombre_completo || '',
    telefono: user?.telefono || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre_completo: user.nombre_completo || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // ✅ NUEVO: Validación en frontend
    if (formData.nombre_completo.trim()) {
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!nombreRegex.test(formData.nombre_completo.trim())) {
        Alert.alert('Error', 'El nombre solo puede contener letras y espacios');
        return;
      }
      if (formData.nombre_completo.trim().length < 3) {
        Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
        return;
      }
    }

    if (formData.telefono.trim()) {
      const telefonoRegex = /^[0-9+\-\s()]*$/;
      if (!telefonoRegex.test(formData.telefono.trim())) {
        Alert.alert('Error', 'El teléfono solo puede contener números');
        return;
      }
    }

    setLoading(true);
    try {
      await usuariosService.update(user.id, {
        nombre_completo: formData.nombre_completo.trim() || undefined,
        telefono: formData.telefono.trim() || undefined,
      });

      await refreshUser();
      setEditing(false);
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nombre_completo: user.nombre_completo || '',
        telefono: user.telefono || '',
      });
    }
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', onPress: signOut, style: 'destructive' },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const getRolColor = () => {
    switch (user.rol) {
      case 'admin':
        return Colors.warning;
      case 'encargado':
        return Colors.primary;
      case 'trabajador':
        return Colors.success;
      default:
        return Colors.gray;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar y Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.foto_perfil || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.userName}>{user.nombre_completo || user.usuario}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        <View style={[styles.rolBadge, { backgroundColor: getRolColor() + '20' }]}>
          <Text style={[styles.rolText, { color: getRolColor() }]}>
            {ROLES_LABELS[user.rol]}
          </Text>
        </View>
      </View>

      {/* Información Básica */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ℹ️ Información Personal</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          {/* Usuario */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Usuario:</Text>
            <Text style={styles.infoValue}>{user.usuario}</Text>
          </View>

          {/* Nombre Completo */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre Completo:</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={formData.nombre_completo}
                onChangeText={(text) => setFormData({ ...formData, nombre_completo: text })}
                placeholder="Ingresa tu nombre completo"
              />
            ) : (
              <Text style={styles.infoValue}>{user.nombre_completo || 'No especificado'}</Text>
            )}
          </View>

          {/* Teléfono */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                placeholder="Ingresa tu teléfono"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{user.telefono || 'No especificado'}</Text>
            )}
          </View>

          {/* Proveedor */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Autenticación:</Text>
            <Text style={styles.infoValue}>
              {user.provider === 'google' ? '🌐 Google' : '🔐 Local'}
            </Text>
          </View>

          {/* Botones de edición */}
          {editing && (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editButton, styles.editButtonCancel]}
                onPress={handleCancel}
              >
                <Text style={[styles.editButtonText, { color: Colors.danger }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, loading && styles.editButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.editButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Información del Trabajo (si es trabajador) */}
      {user.rol === 'trabajador' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Información Laboral</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Área:</Text>
              <Text style={styles.infoValue}>{user.area_nombre || 'No asignada'}</Text>
            </View>
            {user.puesto && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Puesto:</Text>
                <Text style={styles.infoValue}>{user.puesto}</Text>
              </View>
            )}
            {user.nivel_capacitacion && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nivel:</Text>
                <Text style={styles.infoValue}>{user.nivel_capacitacion}</Text>
              </View>
            )}
            {user.fecha_ingreso && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de Ingreso:</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.fecha_ingreso).toLocaleDateString('es-ES')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Estado de Cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Estado de Cuenta</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View style={[styles.estadoBadge, getEstadoBadgeColor(user.estado_cuenta)]}>
              <Text style={styles.estadoText}>{user.estado_cuenta}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registrado:</Text>
            <Text style={styles.infoValue}>
              {new Date(user.creado_en).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getEstadoBadgeColor = (estado: string) => {
  switch (estado) {
    case 'activo':
      return { backgroundColor: '#f0fdf4', borderColor: Colors.success };
    case 'pendiente':
      return { backgroundColor: '#fef3c7', borderColor: Colors.warning };
    case 'suspendido':
      return { backgroundColor: '#fee2e2', borderColor: Colors.danger };
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
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  rolBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  rolText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.dark,
    flex: 1,
  },
  editInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: Colors.background,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  editButtonDisabled: {
    opacity: 0.6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  logoutButtonText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;