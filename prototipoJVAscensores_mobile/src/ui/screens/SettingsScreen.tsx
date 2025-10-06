import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [gps, setGps] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [push, setPush] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const { getQueue, isDark, toggleTheme } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');

  useEffect(() => {
    (async () => {
      const loc = await Location.getForegroundPermissionsAsync();
      setGps(loc.status);
      const noti = await Notifications.getPermissionsAsync();
      setPush(noti.status);
    })();
  }, []);

  return (
    <Screen>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md
      }}>
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
        {/* Modo Oscuro */}
        <Card style={{ marginBottom: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontWeight: '600', marginBottom: 4 }}>Modo Oscuro</AppText>
              <Caption>Activar o desactivar el modo oscuro</Caption>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={isDark ? theme.colors.primary : theme.colors.border}
            />
          </View>
        </Card>

        {/* Permisos */}
        <Card style={{ marginBottom: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontWeight: '600', marginBottom: 4 }}>Permisos</AppText>
              <Caption>Gestionar los permisos de la aplicación</Caption>
            </View>
            <Icon name="chevron-right" color={theme.colors.textSecondary} size={20} />
          </View>
        </Card>

        {/* Diagnóstico */}
        <Card style={{ marginBottom: theme.spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontWeight: '600', marginBottom: 4 }}>Diagnóstico</AppText>
              <Caption>Verificar la conectividad GPS y de red</Caption>
            </View>
            <Icon name="chevron-right" color={theme.colors.textSecondary} size={20} />
          </View>
        </Card>
      </View>

      {/* Barra de navegación inferior */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        justifyContent: 'space-around',
        ...theme.shadows.md
      }}>
        {/* Ruta */}
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Home')}
        >
          <View style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4
          }}>
            <Icon name="map" color={theme.colors.textSecondary} size={24} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.textSecondary }}>
            Ruta
          </AppText>
        </TouchableOpacity>
        
        {/* Historial */}
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('History')}
        >
          <View style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4
          }}>
            <Icon name="history" color={theme.colors.textSecondary} size={24} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.textSecondary }}>
            Historial
          </AppText>
        </TouchableOpacity>
        
        {/* Notificaciones */}
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4
          }}>
            <Icon name="notifications" color={theme.colors.textSecondary} size={24} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.textSecondary }}>
            Notificaciones
          </AppText>
        </TouchableOpacity>
        
        {/* Ajustes - Activo */}
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4
          }}>
            <Icon name="settings" color={theme.colors.primary} size={24} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.primary, fontWeight: '600' }}>
            Ajustes
          </AppText>
        </View>
      </View>
    </Screen>
  );
}


