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
        // Por defecto mostrar flecha en pantallas internas
        headerBackVisible: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Sistema de Autenticación',
          headerBackVisible: false,
          headerLeft: () => null, // asegura que no muestre flecha
        }}
      />
      <Stack.Screen 
        name="welcome" 
        options={{
          title: 'Bienvenida',
          headerBackVisible: false,
          headerLeft: () => null, // si querés que en welcome no haya flecha
        }}
      />
      <Stack.Screen 
        name="users" 
        options={{
          title: 'Lista de Usuarios',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="user-detail" 
        options={{
          title: 'Detalle de Usuario',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          title: 'Mi Perfil',
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
