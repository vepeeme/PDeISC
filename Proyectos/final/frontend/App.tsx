// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/constants';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor={Colors.primary} />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}