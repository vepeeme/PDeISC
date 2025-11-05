// src/navigation/WorkerNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';

// Worker Screens
import WorkerDashboardScreen from '@/screens/worker/WorkerDashboardScreen';
import WorkerActivitiesScreen from '@/screens/worker/WorkerActivitiesScreen';

// Shared Screens
import ActivityDetailScreen from '@/screens/shared/ActivityDetailsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de Actividades
const ActivitiesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="WorkerActivitiesList"
      component={WorkerActivitiesScreen}
      options={{ title: 'Mis Actividades', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="ActivityDetail"
      component={ActivityDetailScreen}
      options={{ title: 'Detalle de Actividad', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

// Tabs principales del trabajador
const WorkerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Activities':
            iconName = focused ? 'list' : 'list-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.gray,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={WorkerDashboardScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Activities" component={ActivitiesStack} options={{ title: 'Actividades' }} />
  </Tab.Navigator>
);

// Navigator principal
const WorkerNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="WorkerTabs" component={WorkerTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Mi Perfil', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

export default WorkerNavigator;