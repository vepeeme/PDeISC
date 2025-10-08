import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Welcome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, usuario, creado_en } = params;

  const handleCerrarSesion = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.titulo}>¡Bienvenido!</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Usuario:</Text>
              <Text style={styles.value}>{usuario}</Text>
            </View>
            
            {creado_en && (
              <View style={styles.infoRow}>
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
            )}
          </View>

          <View style={styles.successBadge}>
            <Text style={styles.successText}>✓ Sesión iniciada correctamente</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botonCerrarSesion}
          onPress={handleCerrarSesion}
        >
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
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  successBadge: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  successText: {
    color: '#2e7d32',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  botonCerrarSesion: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});