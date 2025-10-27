// Navegación principal con Bottom Tabs
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AppContext';

// Importar pantallas
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ChampionshipsScreen } from '../screens/ChampionshipsScreen';
import { ChampionshipDetailScreen } from '../screens/ChampionshipDetailScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { PaymentDetailScreen } from '../screens/PaymentDetailScreen';
import { PaymentMethodScreen } from '../screens/PaymentMethodScreen';
import { AdminPanelScreen } from '../screens/AdminPanelScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de Campeonatos
const ChampionshipsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ChampionshipsList" 
      component={ChampionshipsScreen}
      options={{ title: 'Campeonatos' }}
    />
    <Stack.Screen 
      name="ChampionshipDetail" 
      component={ChampionshipDetailScreen}
      options={{ title: 'Detalle del Campeonato' }}
    />
  </Stack.Navigator>
);

// Stack de Pagos
const PaymentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PaymentsList" 
      component={PaymentsScreen}
      options={{ title: 'Estado de Pagos' }}
    />
    <Stack.Screen 
      name="PaymentDetail" 
      component={PaymentDetailScreen}
      options={{ title: 'Detalle de Pagos' }}
    />
    <Stack.Screen 
      name="PaymentMethod" 
      component={PaymentMethodScreen}
      options={{ title: 'Método de Pago' }}
    />
  </Stack.Navigator>
);

// Tabs principales
const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Championships') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#e74c3c',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="Championships" 
        component={ChampionshipsStack}
        options={{ title: 'Campeonatos', headerShown: false }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsStack}
        options={{ title: 'Pagos', headerShown: false }}
      />
      {user?.role === 'admin' && (
        <Tab.Screen 
          name="Admin" 
          component={AdminPanelScreen}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
};

// Navegación principal
export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
