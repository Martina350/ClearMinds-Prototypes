import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
          options={{
            title: '🔧 Admin Panel (React Navigation)',
            headerLeft: () => null, // Deshabilitar botón de retroceso
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TecnicoDashboard"
          component={TecnicoScreen}
          options={{
            title: '👷 Panel Técnico (RN)',
            headerLeft: () => null, // Deshabilitar botón de retroceso
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="MyReports"
          component={MyReportsScreen}
          options={{
            title: '📋 Mis Informes (Navigate)',
          }}
        />
        <Stack.Screen
          name="InformeForm"
          component={InformeForm}
          options={{
            title: '📝 Crear Informe (Navigate)',
          }}
        />
        <Stack.Screen
          name="ReportDetail"
          component={ReportDetailScreen}
          options={{
            title: '🔍 Detalle Informe (Navigate)',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};