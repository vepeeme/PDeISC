// src/navigation/AdminNavigator.tsx 
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';

import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '@/screens/admin/AdminUsersScreen';
import AdminAreasScreen from '@/screens/admin/AdminAreasScreen';
import AdminActivitiesScreen from '@/screens/admin/AdminActivitiesScreen';
import AdminRequestsScreen from '@/screens/admin/AdminRequestsScreen';

import ActivityDetailScreen from '@/screens/shared/ActivityDetailsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';

import CreateActivityScreen from '@/screens/supervisor/CreateActivityScreen';
import EditActivityScreen from '@/screens/supervisor/EditActivityScreen';
import AssignWorkersScreen from '@/screens/supervisor/AssignWorkersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ActivitiesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminActivitiesList"
      component={AdminActivitiesScreen}
      options={{ title: 'Actividades', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
    <Stack.Screen
      name="ActivityDetail"
      component={ActivityDetailScreen}
      options={{ title: 'Detalle de Actividad', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
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
  </Stack.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            break;
          case 'Users':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Areas':
            iconName = focused ? 'business' : 'business-outline';
            break;
          case 'Activities':
            iconName = focused ? 'list' : 'list-outline';
            break;
          case 'Requests':
            iconName = focused ? 'notifications' : 'notifications-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.gray,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Users" component={AdminUsersScreen} options={{ title: 'Usuarios' }} />
    <Tab.Screen name="Areas" component={AdminAreasScreen} options={{ title: 'Áreas' }} />
    <Tab.Screen name="Activities" component={ActivitiesStack} options={{ title: 'Actividades' }} />
    <Tab.Screen name="Requests" component={AdminRequestsScreen} options={{ title: 'Solicitudes' }} />
  </Tab.Navigator>
);

const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Mi Perfil', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: '#fff' }}
    />
  </Stack.Navigator>
);

export default AdminNavigator;