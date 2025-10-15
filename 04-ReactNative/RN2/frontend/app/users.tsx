// frontend/app/users.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPS_DISPONIBLES } from '@/constants/api';

interface Usuario {
  id: number;
  usuario: string;
  email?: string;
  nombre_completo?: string;
  telefono?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  foto_perfil?: string;
  foto_documento?: string;
  provider: string;
  creado_en: string;
}

export default function Users() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [usuarioActualId, setUsuarioActualId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);

  useEffect(() => {
    cargarUsuarioActual();
    cargarUsuarios();
  }, []);

  // Auto-ocultar mensajes después de 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
  };

  // Cargar ID del usuario actual desde AsyncStorage
  const cargarUsuarioActual = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');
      if (usuarioGuardado) {
        const datos = JSON.parse(usuarioGuardado);
        setUsuarioActualId(datos.id);
      }
    } catch (error) {
      console.error('Error al cargar usuario actual:', error);
    }
  };

  // Cargar lista de usuarios con TODOS los campos
  const cargarUsuarios = async () => {
    try {
      let usuariosCargados = false;

      for (const baseUrl of IPS_DISPONIBLES) {
        try {
          const response = await axios.get<Usuario[]>(
            `${baseUrl}/usuarios`,
            { timeout: 10000 }
          );

          setUsuarios(response.data);
          usuariosCargados = true;
          break;
        } catch (err) {
          console.log(`Falló con ${baseUrl}`);
          continue;
        }
      }

      if (!usuariosCargados) {
        throw new Error('No se pudo conectar con el servidor');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      mostrarMensaje('error', 'No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  // Refrescar lista
  const onRefresh = () => {
    setRefrescando(true);
    cargarUsuarios();
  };

  // Navegar al detalle del usuario con TODOS los parámetros
  const verDetalleUsuario = (usuario: Usuario) => {
    const esPropio = usuario.id === usuarioActualId;

    if (esPropio) {
      router.push({
        pathname: '/profile',
        params: {
          id: usuario.id.toString(),
          usuario: usuario.usuario,
          email: usuario.email || '',
          nombre_completo: usuario.nombre_completo || '',
          telefono: usuario.telefono || '',
          direccion: usuario.direccion || '',
          latitud: usuario.latitud?.toString() || '',
          longitud: usuario.longitud?.toString() || '',
          foto_perfil: usuario.foto_perfil || '',
          foto_documento: usuario.foto_documento || '',
          provider: usuario.provider,
          creado_en: usuario.creado_en,
        },
      });
    } else {
      // Si es otro usuario, ir a la pantalla de solo lectura con TODOS los datos
      router.push({
        pathname: '/user-detail',
        params: {
          id: usuario.id.toString(),
          usuario: usuario.usuario,
          email: usuario.email || '',
          nombre_completo: usuario.nombre_completo || '',
          telefono: usuario.telefono || '',
          direccion: usuario.direccion || '',
          latitud: usuario.latitud?.toString() || '',
          longitud: usuario.longitud?.toString() || '',
          foto_perfil: usuario.foto_perfil || '',
          foto_documento: usuario.foto_documento || '',
          provider: usuario.provider,
          creado_en: usuario.creado_en,
          esPropio: 'false',
        },
      });
    }
  };

  // Renderizar cada usuario
  const renderUsuario = ({ item }: { item: Usuario }) => {
    const esUsuarioActual = item.id === usuarioActualId;

    return (
      <TouchableOpacity
        style={[
          styles.tarjetaUsuario,
          esUsuarioActual && styles.tarjetaUsuarioActual,
        ]}
        onPress={() => verDetalleUsuario(item)}
      >
        <View style={styles.contenidoTarjeta}>
          {/* Foto de perfil */}
          {item.foto_perfil ? (
            <Image
              source={{ uri: item.foto_perfil }}
              style={styles.fotoPerfil}
            />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Ionicons name="person" size={30} color="#999" />
            </View>
          )}

          {/* Información del usuario */}
          <View style={styles.infoUsuario}>
            <View style={styles.filaUsuario}>
              <Text style={styles.nombreUsuario}>
                {item.nombre_completo || item.usuario}
              </Text>
              {esUsuarioActual && (
                <View style={styles.badgeActual}>
                  <Text style={styles.textoBadgeActual}>Tú</Text>
                </View>
              )}
            </View>

            <Text style={styles.usuarioSecundario}>@{item.usuario}</Text>

            {item.email && (
              <Text style={styles.emailUsuario}>{item.email}</Text>
            )}

            {/* Indicadores de información completa */}
            <View style={styles.contenedorIndicadores}>
              {item.telefono && (
                <View style={styles.indicador}>
                  <Ionicons name="call" size={12} color="#4CAF50" />
                </View>
              )}
              {item.direccion && (
                <View style={styles.indicador}>
                  <Ionicons name="location" size={12} color="#4CAF50" />
                </View>
              )}
              {item.foto_documento && (
                <View style={styles.indicador}>
                  <Ionicons name="document" size={12} color="#4CAF50" />
                </View>
              )}
            </View>

            {/* Badge del provider */}
            <View style={styles.contenedorBadges}>
              <View
                style={[
                  styles.badgeProvider,
                  item.provider === 'google' && styles.badgeGoogle,
                  item.provider === 'local' && styles.badgeLocal,
                ]}
              >
                <Ionicons
                  name={
                    item.provider === 'google'
                      ? 'logo-google'
                      : 'key-outline'
                  }
                  size={12}
                  color="#fff"
                />
                <Text style={styles.textoBadgeProvider}>
                  {item.provider === 'google' ? 'Google' : 'Local'}
                </Text>
              </View>
            </View>
          </View>

          {/* Icono de flecha */}
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.textoCargando}>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MENSAJE FLOTANTE */}
      {mensaje && (
        <View style={[
          styles.mensajeFlotante,
          mensaje.tipo === 'exito' ? styles.mensajeExito : styles.mensajeError
        ]}>
          <Ionicons 
            name={mensaje.tipo === 'exito' ? 'checkmark-circle' : 'alert-circle'} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.textoMensaje}>{mensaje.texto}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Ionicons name="people" size={24} color="#007AFF" />
        <Text style={styles.tituloHeader}>
          {usuarios.length} {usuarios.length === 1 ? 'Usuario' : 'Usuarios'}
        </Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.textoVacio}>No hay usuarios registrados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mensajeFlotante: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mensajeExito: {
    backgroundColor: '#4CAF50',
  },
  mensajeError: {
    backgroundColor: '#f44336',
  },
  textoMensaje: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textoCargando: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  lista: {
    padding: 15,
  },
  tarjetaUsuario: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tarjetaUsuarioActual: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  contenidoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  fotoPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  fotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  infoUsuario: {
    flex: 1,
  },
  filaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  badgeActual: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  textoBadgeActual: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  usuarioSecundario: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emailUsuario: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  contenedorIndicadores: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  indicador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeProvider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeGoogle: {
    backgroundColor: '#DB4437',
  },
  badgeLocal: {
    backgroundColor: '#007AFF',
  },
  textoBadgeProvider: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  textoVacio: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
  },
});