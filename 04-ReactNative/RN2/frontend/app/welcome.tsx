// frontend/app/welcome.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { 
    id, 
    usuario, 
    email,
    nombre_completo,
    foto_perfil,
    provider,
    creado_en 
  } = params;

  const handleCerrarSesion = () => {
    router.replace('/');
  };

  const handleVerPerfil = () => {
    router.push({
      pathname: '/profile',
      params: params,
    });
  };

  const handleVerUsuarios = () => {
    router.push('/users');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          {/* Foto de perfil */}
          {foto_perfil ? (
            <Image source={{ uri: foto_perfil.toString() }} style={styles.fotoPerfil} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Ionicons name="person" size={50} color="#999" />
            </View>
          )}

          <Text style={styles.titulo}>¡Bienvenido!</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <View style={styles.infoTexto}>
                <Text style={styles.label}>Usuario:</Text>
                <Text style={styles.value}>{usuario}</Text>
              </View>
            </View>

            {email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <View style={styles.infoTexto}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{email.toString()}</Text>
                </View>
              </View>
            )}

            {nombre_completo && (
              <View style={styles.infoRow}>
                <Ionicons name="card-outline" size={20} color="#666" />
                <View style={styles.infoTexto}>
                  <Text style={styles.label}>Nombre:</Text>
                  <Text style={styles.value}>{nombre_completo.toString()}</Text>
                </View>
              </View>
            )}

            {provider && provider !== 'local' && (
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
                <View style={styles.infoTexto}>
                  <Text style={styles.label}>Conectado con:</Text>
                  <Text style={[styles.value, styles.providerBadge]}>
                    {provider.toString().toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
            
            {creado_en && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <View style={styles.infoTexto}>
                  <Text style={styles.label}>Cuenta creada:</Text>
                  <Text style={styles.value}>
                    {new Date(creado_en as string).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#2e7d32" />
            <Text style={styles.successText}>Sesión iniciada correctamente</Text>
          </View>
        </View>

        {/* Botón Ver Perfil */}
        <TouchableOpacity
          style={styles.botonPerfil}
          onPress={handleVerPerfil}
        >
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
          <Text style={styles.botonTexto}>Ver mi perfil</Text>
        </TouchableOpacity>

        {/* Botón Ver Usuarios */}
        <TouchableOpacity
          style={styles.botonUsuarios}
          onPress={handleVerUsuarios}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text style={styles.botonTexto}>Ver todos los usuarios</Text>
        </TouchableOpacity>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity
          style={styles.botonCerrarSesion}
          onPress={handleCerrarSesion}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.botonTexto}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  fotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  infoTexto: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  providerBadge: {
    color: '#007AFF',
    fontWeight: '700',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  botonPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 10,
  },
  botonUsuarios: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 10,
  },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 10,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});