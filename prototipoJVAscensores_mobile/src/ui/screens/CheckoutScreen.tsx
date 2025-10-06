import React from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { getTheme } from '../theme/tokens';

export function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { otId } = route.params ?? {};
  const { dispatchEvent, isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  return (
    <Screen>
      <Title>Salida OT {otId}</Title>
      <View style={{ height: theme.spacing.md }} />
      <Card>
        <AppText>Resumen de tiempos y evidencias</AppText>
      </Card>
      <View style={{ height: theme.spacing.lg }} />
      <AppButton
        title="Cerrar OT"
        onPress={async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            dispatchEvent({ type: 'CHECK_OUT', otId, lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy ?? undefined });
          }
          dispatchEvent({ type: 'CLOSE_OT', otId });
          navigation.navigate('CloseOt', { otId });
        }}
        icon="check"
      />
    </Screen>
  );
}


