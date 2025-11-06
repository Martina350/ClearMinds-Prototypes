// Navegación principal con Bottom Tabs
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuth, useApp } from '../context/AppContext';

// Importar pantallas
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ChampionshipsScreen } from '../screens/ChampionshipsScreen';
import { ChampionshipDetailScreen } from '../screens/ChampionshipDetailScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { PaymentDetailScreen } from '../screens/PaymentDetailScreen';
import { PaymentMethodScreen } from '../screens/PaymentMethodScreen';
import { AdminPanelScreen } from '../screens/AdminPanelScreen';
import { AdminPaymentsScreen } from '../screens/AdminPaymentsScreen';
import { AdminChampionshipsScreen } from '../screens/AdminChampionshipsScreen';
import { ManageChampionshipScreen } from '../screens/ManageChampionshipScreen';
import { ReviewPaymentScreen } from '../screens/ReviewPaymentScreen';
import { CardPaymentsScreen } from '../screens/CardPaymentsScreen';
import { TransferPaymentsScreen } from '../screens/TransferPaymentsScreen';
import { PaymentReportScreen } from '../screens/PaymentReportScreen';
import { CreateChampionshipScreen } from '../screens/CreateChampionshipScreen';
import { RegisterResultScreen } from '../screens/RegisterResultScreen';
import { RemindersScreen } from '../screens/RemindersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de Campeonatos
const ChampionshipsStack = () => {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E62026',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="ChampionshipsList" 
        component={ChampionshipsScreen}
        options={{ 
          title: 'Campeonatos',
          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
              style={{ marginRight: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
            >
              <Ionicons name="log-out-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="ChampionshipDetail" 
        component={ChampionshipDetailScreen}
        options={{ 
          title: 'Detalle del Campeonato',
          headerBackTitleVisible: false // Ocultar texto junto a la flecha
        }}
      />
    </Stack.Navigator>
  );
};

// Stack de Pagos
const PaymentsStack = () => {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E62026',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="PaymentsList" 
        component={PaymentsScreen}
        options={{ 
          title: 'Estado de Pagos',
          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
              style={{ marginRight: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
            >
              <Ionicons name="log-out-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="PaymentDetail" 
        component={PaymentDetailScreen}
        options={{ 
          title: 'Detalle de Pagos',
          headerBackTitleVisible: false // Ocultar texto junto a la flecha
        }}
      />
      <Stack.Screen 
        name="PaymentMethod" 
        component={PaymentMethodScreen}
        options={{ 
          title: 'Método de Pago',
          headerBackTitleVisible: false // Ocultar texto junto a la flecha
        }}
      />
    </Stack.Navigator>
  );
};

// Tabs principales
const MainTabs = () => {
  const { user, logout } = useAuth();
  const { 
    getPendingPaymentsCount, 
    getUnreadNotificationsCount, 
    getUpcomingMatchesCount 
  } = useApp();

  // Badge component
  const TabBarBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <View style={badgeStyles.badge}>
        <Text style={badgeStyles.badgeText}>{count > 9 ? '9+' : count}</Text>
      </View>
    );
  };

  const commonScreenOptions = ({ route }: any) => ({
    tabBarIcon: ({ focused, color, size }: any) => {
      let iconName: keyof typeof Ionicons.glyphMap;
      let badgeCount = 0;

      // Íconos para tabs comunes y de admin
      switch (route.name) {
        case 'Home':
          iconName = focused ? 'home' : 'home-outline';
          badgeCount = getUnreadNotificationsCount();
          break;
        case 'Championships':
        case 'AdminChampionshipsTab':
          iconName = focused ? 'trophy' : 'trophy-outline';
          badgeCount = getUpcomingMatchesCount();
          break;
        case 'Payments':
          iconName = focused ? 'card' : 'card-outline';
          badgeCount = user ? getPendingPaymentsCount(user.id) : 0;
          break;
        case 'AdminPaymentsTab':
          iconName = focused ? 'card' : 'card-outline';
          break;
        case 'Admin':
          iconName = focused ? 'settings' : 'settings-outline';
          break;
        default:
          iconName = 'help-outline';
      }

      return (
        <View>
          <Ionicons name={iconName} size={size} color={color} />
          <TabBarBadge count={badgeCount} />
        </View>
      );
    },
    tabBarActiveTintColor: '#E62026',
    tabBarInactiveTintColor: '#FFFFFF',
    tabBarStyle: {
      backgroundColor: '#0A0D14',
      borderTopWidth: 1,
      borderTopColor: '#E5E5E5',
      paddingBottom: 8,
      paddingTop: 8,
      height: 64,
    },
    headerStyle: {
      backgroundColor: '#E62026',
    },
    headerTintColor: '#FFFFFF',
    // Evitar over-typing en headerTitleStyle que causa warnings en algunos tipos
    headerRight: () => (
      <TouchableOpacity
        onPress={logout}
        style={{ marginRight: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
      >
        <Ionicons name="log-out-outline" size={22} color="#ffffff" />
      </TouchableOpacity>
    ),
  });

  // Si es admin, mostrar tabs exclusivos de admin
  if (user?.role === 'admin') {
    return (
      <Tab.Navigator screenOptions={commonScreenOptions}>
        <Tab.Screen
          name="Admin"
          component={AdminPanelScreen}
          options={{ title: 'Dashboard' }}
        />
        <Tab.Screen
          name="AdminPaymentsTab"
          component={AdminPaymentsScreen}
          options={{ title: 'Gestión de Pagos', headerShown: true }}
        />
        <Tab.Screen
          name="AdminChampionshipsTab"
          component={AdminChampionshipsScreen}
          options={{ title: 'Gestión de Campeonatos', headerShown: true }}
        />
      </Tab.Navigator>
    );
  }

  // Tabs para usuarios no admin (padres)
  return (
    <Tab.Navigator screenOptions={commonScreenOptions}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="Championships" 
        component={ChampionshipsStack}
        options={{ 
          title: 'Campeonatos',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsStack}
        options={{ 
          title: 'Pagos',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

// Navegación principal
export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="ChampionshipDetail" 
              component={ChampionshipDetailScreen}
              options={{ 
                headerShown: true,
                title: 'Detalle del Campeonato',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="ManageChampionship" 
              component={ManageChampionshipScreen}
              options={{
                headerShown: true,
                title: 'Gestionar Campeonato',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="ReviewPayment" 
              component={ReviewPaymentScreen}
              options={{
                headerShown: true,
                title: 'Revisar Pago',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="CardPayments" 
              component={CardPaymentsScreen}
              options={{
                headerShown: true,
                title: 'Pagos por Tarjeta',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="TransferPayments" 
              component={TransferPaymentsScreen}
              options={{
                headerShown: true,
                title: 'Pagos por Transferencia',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="PaymentReport" 
              component={PaymentReportScreen}
              options={{
                headerShown: true,
                title: 'Reporte de Pagos',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="CreateChampionship" 
              component={CreateChampionshipScreen}
              options={{
                headerShown: true,
                title: 'Crear Campeonato',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="RegisterResult" 
              component={RegisterResultScreen}
              options={{
                headerShown: true,
                title: 'Registrar Resultado',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false, // Ocultar texto junto a la flecha
              }}
            />
            <Stack.Screen 
              name="AdminPayments" 
              component={AdminPaymentsScreen}
              options={{
                headerShown: false, // Usar header personalizado
              }}
            />
            <Stack.Screen 
              name="AdminChampionships" 
              component={AdminChampionshipsScreen}
              options={{
                headerShown: false, // Usar header personalizado
              }}
            />
            <Stack.Screen 
              name="Reminders" 
              component={RemindersScreen}
              options={{
                headerShown: true,
                title: 'Recordatorios',
                headerStyle: {
                  backgroundColor: '#E62026',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerBackTitleVisible: false,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Estilos para badges
const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#E62026',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
