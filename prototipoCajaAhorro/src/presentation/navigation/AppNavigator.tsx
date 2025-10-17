import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
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

/**
 * Componente del logo para el header
 */
const HeaderLogo = () => (
  <Image
    source={require('../assets/logoSantaTeresita3.png')}
    style={{ width: 60, height: 24, resizeMode: 'contain' }}
  />
);

/**
 * Stack Navigator para la pantalla de inicio y sus servicios
 */
const HomeStack = () => (
  <Stack.Navigator
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
    <Stack.Screen name="AperturaCuentas" component={AperturaSeleccionScreen} options={{ title: 'Apertura de Cuentas', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="AperturaBasica" component={AperturaBasicaScreen} options={{ title: 'Cuenta de Ahorro Básica', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="AperturaInfantil" component={AperturaInfantilScreen} options={{ title: 'Cuenta de Ahorro Infantil', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="AhorroFuturo" component={AhorroFuturoScreen} options={{ title: 'Cuenta de Ahorro Futuro', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="Depositos" component={DepositosScreen} options={{ title: 'Depósitos', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="Cobros" component={CobrosScreen} options={{ title: 'Cobros', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="Recibo" component={ReciboScreen} options={{ title: 'Recibo e Impresión', headerRight: () => <HeaderLogo /> }} />
    <Stack.Screen name="Consultas" component={ConsultasClientesScreen} options={{ title: 'Consultas de Clientes', headerRight: () => <HeaderLogo /> }} />
  </Stack.Navigator>
);


/**
 * Navegador principal de la aplicación
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio"
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
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Actividad" component={ActividadScreen} />
        <Tab.Screen name="Imprimir" component={PlaceholderImprimir} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

