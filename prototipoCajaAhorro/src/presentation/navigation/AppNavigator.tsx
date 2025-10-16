import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AperturaSeleccionScreen } from '../screens/AperturaSeleccionScreen';
import { AperturaBasicaScreen } from '../screens/AperturaBasicaScreen';
import { AperturaInfantilScreen } from '../screens/AperturaInfantilScreen';
import { AhorroFuturoScreen } from '../screens/AhorroFuturoScreen';
import { DepositosScreen } from '../screens/DepositosScreen';
import { CobrosScreen } from '../screens/CobrosScreen';
import { ReciboScreen } from '../screens/ReciboScreen';
import { ConsultasClientesScreen } from '../screens/ConsultasClientesScreen';
import { ActividadScreen } from '../screens/ActividadScreen';

/**
 * Tipos de navegación
 */
export type RootStackParamList = {
  Home: undefined;
  AperturaCuentas: undefined;
  AperturaBasica: undefined;
  AperturaInfantil: undefined;
  AhorroFuturo: undefined;
  Depositos: undefined;
  Cobros: undefined;
  Recibo: undefined;
  Consultas: undefined;
  Dashboard: undefined;
  Tabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

import { PerfilScreen } from '../screens/PerfilScreen';

const PlaceholderImprimir = () => null;

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.border,
      tabBarLabelStyle: { fontWeight: '700' },
      tabBarStyle: { backgroundColor: theme.colors.background },
      tabBarIcon: ({ color, size }) => {
        const map: Record<string, keyof typeof MaterialIcons.glyphMap> = {
          Inicio: 'home',
          Actividad: 'history',
          Imprimir: 'print',
          Perfil: 'person',
        };
        const name = map[route.name] || 'circle';
        return <MaterialIcons name={name} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Inicio" component={HomeScreen} />
    <Tab.Screen name="Actividad" component={ActividadScreen} />
    <Tab.Screen name="Imprimir" component={PlaceholderImprimir} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
);

/**
 * Navegador principal de la aplicación
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen name="AperturaCuentas" component={AperturaSeleccionScreen} options={{ title: 'Apertura de Cuentas' }} />
        <Stack.Screen name="AperturaBasica" component={AperturaBasicaScreen} options={{ title: 'Cuenta de Ahorro Básica' }} />
        <Stack.Screen name="AperturaInfantil" component={AperturaInfantilScreen} options={{ title: 'Cuenta de Ahorro Infantil' }} />
        <Stack.Screen name="AhorroFuturo" component={AhorroFuturoScreen} options={{ title: 'Cuenta de Ahorro Futuro' }} />
        <Stack.Screen name="Depositos" component={DepositosScreen} options={{ title: 'Depósitos' }} />
        <Stack.Screen name="Cobros" component={CobrosScreen} options={{ title: 'Cobros' }} />
        <Stack.Screen name="Recibo" component={ReciboScreen} options={{ title: 'Recibo e Impresión' }} />
        <Stack.Screen name="Consultas" component={ConsultasClientesScreen} options={{ title: 'Consultas de Clientes' }} />
        {/* Aquí se agregarán más pantallas según se vayan desarrollando */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

