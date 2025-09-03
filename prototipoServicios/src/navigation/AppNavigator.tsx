import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import { RootStackParamList } from './types';
import { colors } from '../styles/theme';

// Screens
import { UnifiedLoginScreen } from '../screens/UnifiedLoginScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { TecnicoScreen } from '../screens/TecnicoScreen';
import { MyReportsScreen } from '../screens/MyReportsScreen';
import { InformeForm } from '../screens/InformeForm';
import { ReportDetailScreen } from '../screens/ReportDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: colors.textInverse,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitle: '',
          cardStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Login"
          component={UnifiedLoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminScreen}
          options={({ navigation }) => ({
            title: 'Admin Panel',
            headerLeft: () => null, // Deshabilitar botón de retroceso
            gestureEnabled: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }
                style={{ marginRight: 12, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#DC2626', borderRadius: 16 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Log Out</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="TecnicoDashboard"
          component={TecnicoScreen}
          options={({ navigation }) => ({
            title: 'Panel Técnico',
            headerLeft: () => null, // Deshabilitar botón de retroceso
            gestureEnabled: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }
                style={{ marginRight: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#DC2626', borderRadius: 16 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Log Out</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="MyReports"
          component={MyReportsScreen}
          options={{
            title: 'Mis Informes',
          }}
        />
        <Stack.Screen
          name="InformeForm"
          component={InformeForm}
          options={{
            title: 'Crear Informe',
          }}
        />
        <Stack.Screen
          name="ReportDetail"
          component={ReportDetailScreen}
          options={{
            title: 'Detalle Informe',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
