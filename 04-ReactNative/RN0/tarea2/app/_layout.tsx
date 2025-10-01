import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      // Esta opción se aplica a TODAS las pantallas
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}