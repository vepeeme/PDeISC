// src/navigation/SupervisorNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';

// Supervisor Screens
import SupervisorDashboardScreen from '@/screens/supervisor/SupervisorDashboardScreen';
import SupervisorActivitiesScreen from '@/screens/supervisor/SupervisorActivitiesScreen';
import CreateActivityScreen from '@/screens/supervisor/CreateActivityScreen';
import EditActivityScreen from '@/screens/supervisor/EditActivityScreen';
import AssignWorkersScreen from '@/screens/supervisor/AssignWorkersScreen';

// Shared Screens
import ActivityDetailScreen from '@/screens/shared/ActivityDetailsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de Actividades
const ActivitiesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SupervisorActivitiesList"
      component={SupervisorActivitiesScreen}
      options={{ title: 'Mis Actividades', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="CreateActivity"
      component={CreateActivityScreen}
      options={{ title: 'Crear Actividad', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="EditActivity"
      component={EditActivityScreen}
      options={{ title: 'Editar Actividad', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="AssignWorkers"
      component={AssignWorkersScreen}
      options={{ title: 'Asignar Trabajadores', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="ActivityDetail"
      component={ActivityDetailScreen}
      options={{ title: 'Detalle de Actividad', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

// Tabs principales del encargado
const SupervisorTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
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
    <Tab.Screen name="Dashboard" component={SupervisorDashboardScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Activities" component={ActivitiesStack} options={{ title: 'Actividades' }} />
  </Tab.Navigator>
);

// Navigator principal
const SupervisorNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="SupervisorTabs" component={SupervisorTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Mi Perfil', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

export default SupervisorNavigator;