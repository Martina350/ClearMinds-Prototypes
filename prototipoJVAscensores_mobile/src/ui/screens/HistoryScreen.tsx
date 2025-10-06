import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getOtsToday } from '../../infra/mock/mockApi';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { StatusBadge } from '../components/StatusBadge';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const data = getOtsToday();
  const theme = getTheme('light');
  
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

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          {/* Sección Hoy */}
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.lg }}>
            Hoy
          </Title>

          {/* Lista de OTs */}
          {data.map((ot) => (
            <TouchableOpacity
              key={ot.id}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radii.lg,
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                ...theme.shadows.sm
              }}
              onPress={() => navigation.navigate('OtDetail', { otId: ot.id })}
            >
              {/* Icono de estado */}
              <View style={{
                width: 48,
                height: 48,
                borderRadius: theme.radii.md,
                backgroundColor: theme.colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.lg
              }}>
                <Icon 
                  name="schedule" 
                  color={theme.colors.primary} 
                  size={24} 
                />
              </View>
              
              {/* Contenido */}
              <View style={{ flex: 1 }}>
                <AppText style={{ fontWeight: '700', fontSize: theme.typography.body, marginBottom: 4 }}>
                  {ot.id}
                </AppText>
                <StatusBadge status={ot.estado} size="sm" />
              </View>
              
              {/* Flecha */}
              <Icon name="chevron-right" color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navegación inferior simulada */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        justifyContent: 'space-around'
      }}>
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="map" color={theme.colors.textSecondary} size={24} />
          <Caption style={{ marginTop: 4 }}>Ruta del Día</Caption>
        </TouchableOpacity>
        
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="history" color={theme.colors.primary} size={24} />
          </View>
          <Caption style={{ marginTop: 4, color: theme.colors.primary }}>Historial</Caption>
        </View>
        
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" color={theme.colors.textSecondary} size={24} />
          <Caption style={{ marginTop: 4 }}>Notificaciones</Caption>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" color={theme.colors.textSecondary} size={24} />
          <Caption style={{ marginTop: 4 }}>Ajustes</Caption>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}


