import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import RegisterScreen from '@/screens/RegisterScreen';
import HomeScreen from '@/screens/HomeScreen';
import ResultsScreen from '@/screens/ResultsScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AdminScreen from '@/screens/AdminScreen';
import { Colors } from '@/theme/colors';

type RootStackParamList = {
  Register: undefined;
  MainTabs: undefined;
  Results: { mood: string; label?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[200],
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...Colors.Shadows.medium,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: Colors.primary[600], // Azul principal para tabs activos
        tabBarInactiveTintColor: Colors.neutral[600], // Gris Medio para tabs inactivos
        headerStyle: {
          backgroundColor: '#ffffff', // Fondo blanco para headers
          ...Colors.Shadows.small,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Roboto-Bold',
          color: Colors.neutral[800], // Gris Oscuro - Texto principal
        },
        headerTintColor: Colors.primary[600], // Azul principal para botones de navegación
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          headerTitle: '¿Cómo te sientes?',
        }}
      />
      <Tab.Screen 
        name="Historial" 
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="analytics" size={size} color={color} />
          ),
          headerTitle: 'Mi Progreso',
        }}
      />
      <Tab.Screen 
        name="Ajustes" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
          headerTitle: 'Configuración',
        }}
      />
      <Tab.Screen 
        name="Admin" 
        component={AdminScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="admin-panel-settings" size={size} color={color} />
          ),
          headerTitle: 'Dashboard Admin',
          tabBarLabel: 'Admin',
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff', // Fondo blanco para headers
          ...Colors.Shadows.small,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Roboto-Bold',
          color: Colors.neutral[800], // Gris Oscuro - Texto principal
        },
        headerTintColor: Colors.primary[600], // Azul principal para botones de navegación
      }}
    >
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ 
          title: 'Tus Recomendaciones',
          headerBackTitle: 'Volver',
          presentation: 'modal',
        }} 
      />
    </Stack.Navigator>
  );
}


