// src/navigation/RootNavigator.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants';

// Auth Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterWorkerScreen from '@/screens/auth/RegisterWorkerScreen';
import RegisterSupervisorScreen from '@/screens/auth/RegisterSupervisorScreen';
import CompleteGoogleRegisterScreen from '@/screens/auth/CompleteGoogleRegisterScreen';

// Admin Navigator
import AdminNavigator from './AdminNavigator';
// Encargado Navigator
import SupervisorNavigator from './SupervisorNavigator';
// Trabajador Navigator
import WorkerNavigator from './WorkerNavigator';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, loading, isAdmin, isEncargado, isTrabajador } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterWorker" component={RegisterWorkerScreen} />
          <Stack.Screen name="RegisterSupervisor" component={RegisterSupervisorScreen} />
          <Stack.Screen name="CompleteGoogleRegister" component={CompleteGoogleRegisterScreen} />
        </>
      ) : (
        // Main Stack según rol
        <>
          {isAdmin && <Stack.Screen name="AdminApp" component={AdminNavigator} />}
          {isEncargado && <Stack.Screen name="SupervisorApp" component={SupervisorNavigator} />}
          {isTrabajador && <Stack.Screen name="WorkerApp" component={WorkerNavigator} />}
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;