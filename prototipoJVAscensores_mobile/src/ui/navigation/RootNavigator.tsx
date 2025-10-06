import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { OtDetailScreen } from '../screens/OtDetailScreen';
import { CheckinScreen } from '../screens/CheckinScreen';
import { ChecklistScreen } from '../screens/ChecklistScreen';
import { SignatureScreen } from '../screens/SignatureScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { CloseOtScreen } from '../screens/CloseOtScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  OtDetail: { otId: string };
  Checkin: { otId: string };
  Checklist: { otId: string };
  Signature: { otId: string };
  Checkout: { otId: string };
  CloseOt: { otId: string };
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ruta del día' }} />
      <Stack.Screen name="OtDetail" component={OtDetailScreen} options={{ title: 'Detalle OT' }} />
      <Stack.Screen name="Checkin" component={CheckinScreen} options={{ title: 'Llegada' }} />
      <Stack.Screen name="Checklist" component={ChecklistScreen} options={{ title: 'Checklist' }} />
      <Stack.Screen name="Signature" component={SignatureScreen} options={{ title: 'Firma' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Salida' }} />
      <Stack.Screen name="CloseOt" component={CloseOtScreen} options={{ title: 'Cierre' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historial del día' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
    </Stack.Navigator>
  );
}


