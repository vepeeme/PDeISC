// frontend/app/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IPS_DISPONIBLES } from '@/constants/api';

export default function Profile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);
  
  const [id, setId] = useState(params.id?.toString() || '');
  const [usuario, setUsuario] = useState(params.usuario?.toString() || '');
  const [email, setEmail] = useState(params.email?.toString() || '');
  const [nombreCompleto, setNombreCompleto] = useState(params.nombre_completo?.toString() || '');
  const [telefono, setTelefono] = useState(params.telefono?.toString() || '');
  const [direccion, setDireccion] = useState(params.direccion?.toString() || '');
  const [fotoPerfil, setFotoPerfil] = useState(params.foto_perfil?.toString() || '');
  const [fotoDocumento, setFotoDocumento] = useState(params.foto_documento?.toString() || '');

  // Inicializar lat/long desde params si vienen
  const initialLat = params.latitud ? parseFloat(params.latitud.toString()) : null;
  const initialLon = params.longitud ? parseFloat(params.longitud.toString()) : null;
  const [latitud, setLatitud] = useState<number | null>(initialLat !== undefined ? initialLat : null);
  const [longitud, setLongitud] = useState<number | null>(initialLon !== undefined ? initialLon : null);

  const [modalFotoVisible, setModalFotoVisible] = useState(false);

  useEffect(() => {
    cargarDatosGuardados();
  }, []);

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

  const cargarDatosGuardados = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');
      if (usuarioGuardado) {
        const datos = JSON.parse(usuarioGuardado);
        setId(datos.id?.toString() || id);
        setUsuario(datos.usuario || usuario);
        setEmail(datos.email || email);
        setNombreCompleto(datos.nombre_completo || nombreCompleto);
        setTelefono(datos.telefono || telefono);
        setDireccion(datos.direccion || direccion);
        setFotoPerfil(datos.foto_perfil || fotoPerfil);
        setFotoDocumento(datos.foto_documento || fotoDocumento);
        
        const lat = datos.latitud ? parseFloat(datos.latitud.toString()) : null;
        const lon = datos.longitud ? parseFloat(datos.longitud.toString()) : null;
        setLatitud(lat !== null && !isNaN(lat) ? lat : null);
        setLongitud(lon !== null && !isNaN(lon) ? lon : null);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const seleccionarFotoPerfil = () => {
    setModalFotoVisible(true);
  };

  const tomarFotoPerfil = async () => {
    setModalFotoVisible(false);
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permiso.granted) {
      mostrarMensaje('error', 'Necesitamos acceso a tu cámara');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
      setFotoPerfil(base64Image);
      mostrarMensaje('exito', 'Foto capturada correctamente');
    }
  };

  const elegirDeGaleria = async () => {
    setModalFotoVisible(false);
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permiso.granted) {
      mostrarMensaje('error', 'Necesitamos acceso a tu galería');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
      setFotoPerfil(base64Image);
      mostrarMensaje('exito', 'Foto seleccionada correctamente');
    }
  };

  const tomarFotoDocumento = async () => {
    const permisoCamara = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permisoCamara.granted) {
      mostrarMensaje('error', 'Necesitamos acceso a tu cámara');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.2,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
      setFotoDocumento(base64Image);
      mostrarMensaje('exito', 'Documento escaneado correctamente');
    }
  };

  const obtenerUbicacion = async () => {
    const permiso = await Location.requestForegroundPermissionsAsync();
    
    if (!permiso.granted) {
      mostrarMensaje('error', 'Necesitamos acceso a tu ubicación');
      return;
    }

    setCargando(true);
    try {
      const ubicacion = await Location.getCurrentPositionAsync({});
      const lat = ubicacion.coords.latitude;
      const lon = ubicacion.coords.longitude;
      setLatitud(lat);
      setLongitud(lon);

      const [direccionObj] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });

      if (direccionObj) {
        const direccionTexto = `${direccionObj.street || ''}, ${direccionObj.city || ''}, ${direccionObj.region || ''}, ${direccionObj.country || ''}`.trim();
        setDireccion(direccionTexto);
      }

      mostrarMensaje('exito', 'Ubicación obtenida correctamente');
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      mostrarMensaje('error', 'No se pudo obtener la ubicación');
    } finally {
      setCargando(false);
    }
  };

  const guardarCambios = async () => {
    if (!nombreCompleto.trim()) {
      mostrarMensaje('error', 'El nombre es obligatorio');
      return;
    }

    setCargando(true);

    try {
      let respuestaExitosa = false;

      for (const baseUrl of IPS_DISPONIBLES) {
        try {
          const response = await axios.put(
            `${baseUrl}/usuarios/${id}`,
            {
              nombre_completo: nombreCompleto,
              telefono: telefono,
              direccion: direccion,
              latitud: latitud ?? null,
              longitud: longitud ?? null,
              foto_perfil: fotoPerfil,
              foto_documento: fotoDocumento,
            },
            { timeout: 30000 }
          );

          if (response.data.exito) {
            await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            mostrarMensaje('exito', 'Perfil actualizado correctamente');
            setEditando(false);
            respuestaExitosa = true;
            await cargarDatosGuardados();
            break;
          }
        } catch (err: any) {
          console.log(`Falló con ${baseUrl}:`, err.message);
          continue;
        }
      }

      if (!respuestaExitosa) {
        throw new Error('No se pudo conectar con el servidor');
      }
    } catch (error: any) {
      console.error('Error al guardar:', error);
      mostrarMensaje('error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('usuario');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalFotoVisible}
        onRequestClose={() => setModalFotoVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalFotoVisible(false)}
        >
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Seleccionar foto de perfil</Text>
            
            <TouchableOpacity
              style={styles.opcionModal}
              onPress={tomarFotoPerfil}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.textoOpcionModal}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.opcionModal}
              onPress={elegirDeGaleria}
            >
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.textoOpcionModal}>Elegir de galería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonCancelarModal}
              onPress={() => setModalFotoVisible(false)}
            >
              <Text style={styles.textoCancelarModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={editando ? seleccionarFotoPerfil : undefined}
            style={styles.fotoContainer}
          >
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.fotoPerfil} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Ionicons name="person" size={60} color="#999" />
              </View>
            )}
            {editando && (
              <View style={styles.editarFotoBadge}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonEditar}
            onPress={() => setEditando(!editando)}
          >
            <Ionicons 
              name={editando ? "close" : "pencil"} 
              size={20} 
              color="#007AFF" 
            />
            <Text style={styles.textoEditar}>
              {editando ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contenido}>
          <View style={styles.campo}>
            <Text style={styles.label}>Usuario</Text>
            <Text style={styles.valorFijo}>{usuario}</Text>
          </View>

          {email && (
            <View style={styles.campo}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.valorFijo}>{email}</Text>
            </View>
          )}

          <View style={styles.campo}>
            <Text style={styles.label}>Nombre completo *</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                placeholder="Ingresa tu nombre completo"
              />
            ) : (
              <Text style={styles.valor}>{nombreCompleto || 'No especificado'}</Text>
            )}
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Teléfono</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Ingresa tu teléfono"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.valor}>{telefono || 'No especificado'}</Text>
            )}
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Dirección</Text>
            {editando ? (
              <>
                <TextInput
                  style={[styles.input, styles.inputMultilinea]}
                  value={direccion}
                  onChangeText={setDireccion}
                  placeholder="Ingresa tu dirección"
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={styles.botonUbicacion}
                  onPress={obtenerUbicacion}
                  disabled={cargando}
                >
                  <Ionicons name="location" size={20} color="#007AFF" />
                  <Text style={styles.textoBotonUbicacion}>
                    Usar ubicación actual
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.valor}>{direccion || 'No especificada'}</Text>
            )}
          </View>

          {(latitud !== null && longitud !== null && !isNaN(latitud) && !isNaN(longitud)) && (
            <View style={styles.campo}>
              <Text style={styles.label}>Coordenadas</Text>
              <Text style={styles.valorPequeño}>
                Lat: {latitud.toFixed(6)}, Lon: {longitud.toFixed(6)}
              </Text>
            </View>
          )}

          {editando && (
            <View style={styles.campo}>
              <Text style={styles.label}>Documento de identidad</Text>
              <TouchableOpacity
                style={styles.botonDocumento}
                onPress={tomarFotoDocumento}
              >
                <Ionicons name="camera" size={24} color="#007AFF" />
                <Text style={styles.textoBotonDocumento}>
                  {fotoDocumento ? 'Cambiar foto' : 'Escanear documento'}
                </Text>
              </TouchableOpacity>
              {fotoDocumento && (
                <Image 
                  source={{ uri: fotoDocumento }} 
                  style={styles.previsualizacionDocumento} 
                />
              )}
            </View>
          )}

          {editando ? (
            <TouchableOpacity
              style={[styles.botonGuardar, cargando && styles.botonDeshabilitado]}
              onPress={guardarCambios}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotonGuardar}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonCerrarSesion}
              onPress={cerrarSesion}
            >
              <Text style={styles.textoBotonCerrarSesion}>Cerrar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* Reutilicé el mismo styles que tenías — omito por brevedad (usa tu styles original). */
const styles = StyleSheet.create({
  /* pega aquí tu styles original (lo que ya tenías). */
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  mensajeFlotante: { position: 'absolute', top: 10, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 8, zIndex: 1000, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  mensajeExito: { backgroundColor: '#4CAF50' },
  mensajeError: { backgroundColor: '#f44336' },
  textoMensaje: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContenido: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  opcionModal: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 8, backgroundColor: '#f5f5f5', marginBottom: 10, gap: 15 },
  textoOpcionModal: { fontSize: 16, color: '#333', fontWeight: '600' },
  botonCancelarModal: { marginTop: 10, padding: 15, alignItems: 'center' },
  textoCancelarModal: { fontSize: 16, color: '#999', fontWeight: '600' },
  header: { backgroundColor: '#007AFF', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  fotoContainer: { position: 'relative' },
  fotoPerfil: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  fotoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  editarFotoBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  botonEditar: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, gap: 5 },
  textoEditar: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  contenido: { padding: 20 },
  campo: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  valor: { fontSize: 16, color: '#333', backgroundColor: '#fff', padding: 15, borderRadius: 8 },
  valorFijo: { fontSize: 16, color: '#999', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8 },
  valorPequeño: { fontSize: 14, color: '#666', backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16 },
  inputMultilinea: { minHeight: 80, textAlignVertical: 'top' },
  botonUbicacion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 12, backgroundColor: '#e3f2fd', borderRadius: 8, gap: 8 },
  textoBotonUbicacion: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  botonDocumento: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#fff', borderWidth: 2, borderColor: '#007AFF', borderRadius: 8, borderStyle: 'dashed', gap: 10 },
  textoBotonDocumento: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  previsualizacionDocumento: { width: '100%', height: 200, marginTop: 10, borderRadius: 8, resizeMode: 'cover' },
  botonGuardar: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  botonDeshabilitado: { backgroundColor: '#999' },
  textoBotonGuardar: { color: '#fff', fontSize: 18, fontWeight: '600' },
  botonCerrarSesion: { backgroundColor: '#f44336', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  textoBotonCerrarSesion: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
