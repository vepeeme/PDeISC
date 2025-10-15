// frontend/app/user-detail.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UserDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    id,
    usuario,
    email,
    nombre_completo,
    telefono,
    direccion,
    latitud,
    longitud,
    foto_perfil,
    foto_documento,
    provider,
    creado_en,
    esPropio,
  } = params;

  const esMiPerfil = esPropio === 'true';

  const irAMiPerfil = () => {
    router.push({
      pathname: '/profile',
      params: params,
    });
  };

  // Convertir coordenadas a números
  const lat = latitud ? parseFloat(latitud.toString()) : null;
  const lon = longitud ? parseFloat(longitud.toString()) : null;
  const coordenadasValidas = lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {foto_perfil && foto_perfil !== '' ? (
          <Image source={{ uri: foto_perfil.toString() }} style={styles.fotoPerfil} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Ionicons name="person" size={60} color="#999" />
          </View>
        )}

        {esMiPerfil && (
          <TouchableOpacity style={styles.botonEditar} onPress={irAMiPerfil}>
            <Ionicons name="pencil" size={20} color="#007AFF" />
            <Text style={styles.textoEditar}>Editar mi perfil</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contenido}>
        <Text style={styles.nombrePrincipal}>
          {nombre_completo?.toString() || usuario?.toString()}
        </Text>

        {/* Badge de usuario actual */}
        {esMiPerfil && (
          <View style={styles.badgePropio}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.textoBadgePropio}>Este es tu perfil</Text>
          </View>
        )}

        {/* INFORMACIÓN BÁSICA */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información básica</Text>

          <View style={styles.campo}>
            <View style={styles.iconoCampo}>
              <Ionicons name="person-outline" size={20} color="#666" />
            </View>
            <View style={styles.infoCampo}>
              <Text style={styles.labelCampo}>Usuario</Text>
              <Text style={styles.valorCampo}>{usuario}</Text>
            </View>
          </View>

          {email && email !== '' && (
            <View style={styles.campo}>
              <View style={styles.iconoCampo}>
                <Ionicons name="mail-outline" size={20} color="#666" />
              </View>
              <View style={styles.infoCampo}>
                <Text style={styles.labelCampo}>Email</Text>
                <Text style={styles.valorCampo}>{email.toString()}</Text>
              </View>
            </View>
          )}

          {nombre_completo && nombre_completo !== '' && (
            <View style={styles.campo}>
              <View style={styles.iconoCampo}>
                <Ionicons name="card-outline" size={20} color="#666" />
              </View>
              <View style={styles.infoCampo}>
                <Text style={styles.labelCampo}>Nombre completo</Text>
                <Text style={styles.valorCampo}>{nombre_completo.toString()}</Text>
              </View>
            </View>
          )}

          {telefono && telefono !== '' && (
            <View style={styles.campo}>
              <View style={styles.iconoCampo}>
                <Ionicons name="call-outline" size={20} color="#666" />
              </View>
              <View style={styles.infoCampo}>
                <Text style={styles.labelCampo}>Teléfono</Text>
                <Text style={styles.valorCampo}>{telefono.toString()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* INFORMACIÓN DE UBICACIÓN */}
        {(direccion || coordenadasValidas) && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Ubicación</Text>

            {direccion && direccion !== '' && (
              <View style={styles.campo}>
                <View style={styles.iconoCampo}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                </View>
                <View style={styles.infoCampo}>
                  <Text style={styles.labelCampo}>Dirección</Text>
                  <Text style={styles.valorCampo}>{direccion.toString()}</Text>
                </View>
              </View>
            )}

            {coordenadasValidas && (
              <View style={styles.campo}>
                <View style={styles.iconoCampo}>
                  <Ionicons name="navigate-outline" size={20} color="#666" />
                </View>
                <View style={styles.infoCampo}>
                  <Text style={styles.labelCampo}>Coordenadas GPS</Text>
                  <Text style={styles.valorCampo}>
                    Lat: {lat!.toFixed(6)}, Lon: {lon!.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* DOCUMENTO DE IDENTIDAD */}
        {foto_documento && foto_documento !== '' && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Documento de identidad</Text>
            <Image 
              source={{ uri: foto_documento.toString() }} 
              style={styles.fotoDocumento} 
            />
            <Text style={styles.notaDocumento}>
              📄 Documento verificado
            </Text>
          </View>
        )}

        {/* INFORMACIÓN DEL SISTEMA */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información del sistema</Text>

          {provider && (
            <View style={styles.campo}>
              <View style={styles.iconoCampo}>
                <Ionicons 
                  name={provider === 'google' ? 'logo-google' : 'key-outline'} 
                  size={20} 
                  color="#666" 
                />
              </View>
              <View style={styles.infoCampo}>
                <Text style={styles.labelCampo}>Método de autenticación</Text>
                <Text style={styles.valorCampo}>
                  {provider === 'google' ? 'Google OAuth' : 'Registro tradicional'}
                </Text>
              </View>
            </View>
          )}

          {creado_en && (
            <View style={styles.campo}>
              <View style={styles.iconoCampo}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </View>
              <View style={styles.infoCampo}>
                <Text style={styles.labelCampo}>Miembro desde</Text>
                <Text style={styles.valorCampo}>
                  {new Date(creado_en as string).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Mensaje informativo si no es tu perfil */}
        {!esMiPerfil && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.infoTexto}>
              Solo puedes ver este perfil. Para editar tu información, ve a tu propio perfil.
            </Text>
          </View>
        )}

        {/* Botón para volver */}
        <TouchableOpacity style={styles.botonVolver} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.textoBotonVolver}>Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  botonEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  textoEditar: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contenido: {
    padding: 20,
  },
  nombrePrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgePropio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  textoBadgePropio: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  seccion: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconoCampo: {
    width: 40,
    alignItems: 'center',
  },
  infoCampo: {
    flex: 1,
  },
  labelCampo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  valorCampo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  fotoDocumento: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  notaDocumento: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    gap: 10,
    marginBottom: 20,
  },
  infoTexto: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  textoBotonVolver: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});