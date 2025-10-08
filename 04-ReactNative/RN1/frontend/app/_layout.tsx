// frontend/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackVisible: false, // ← QUITA LA FLECHA EN TODAS LAS PANTALLAS
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Sistema de Autenticación',
        }}
      />
      <Stack.Screen 
        name="welcome" 
        options={{
          title: 'Bienvenida',
        }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}