import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
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
          {/* Sección Urgente */}
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.lg }}>
            Urgente
          </Title>

          {/* Nueva orden de trabajo */}
          <View style={{
            backgroundColor: theme.colors.urgent,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            ...theme.shadows.sm
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFCDD2',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.lg
            }}>
              <AppText style={{ color: theme.colors.card, fontSize: 20, fontWeight: '700' }}>!</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ 
                color: theme.colors.card, 
                fontWeight: '700', 
                fontSize: theme.typography.body,
                marginBottom: 4
              }}>
                Nueva orden de trabajo asignada
              </AppText>
              <AppText style={{ 
                color: theme.colors.card, 
                fontSize: theme.typography.bodySmall 
              }}>
                OT-2024-00123
              </AppText>
            </View>
          </View>

          {/* Reprogramación de emergencia */}
          <View style={{
            backgroundColor: theme.colors.warning,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            ...theme.shadows.sm
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FB8C00',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.lg
            }}>
              <Icon name="warning" color={theme.colors.card} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ 
                color: '#E65100', 
                fontWeight: '700', 
                fontSize: theme.typography.body,
                marginBottom: 4
              }}>
                Reprogramación de emergencia
              </AppText>
              <AppText style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.typography.bodySmall 
              }}>
                La OT-2024-00122 ha sido cancelada.
              </AppText>
            </View>
          </View>

          {/* Sección Reprogramaciones */}
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.lg }}>
            Reprogramaciones
          </Title>

          {/* Reprogramada para el 15 de Julio */}
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            ...theme.shadows.sm
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: theme.radii.md,
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.lg
            }}>
              <Icon name="calendar-today" color={theme.colors.textSecondary} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ 
                color: theme.colors.text, 
                fontWeight: '700', 
                fontSize: theme.typography.body,
                marginBottom: 4
              }}>
                Reprogramada para el 15 de Julio
              </AppText>
              <AppText style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.typography.bodySmall 
              }}>
                OT-2024-00124
              </AppText>
            </View>
          </View>

          {/* Reprogramada para el 16 de Julio */}
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            ...theme.shadows.sm
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: theme.radii.md,
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.lg
            }}>
              <Icon name="calendar-today" color={theme.colors.textSecondary} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={{ 
                color: theme.colors.text, 
                fontWeight: '700', 
                fontSize: theme.typography.body,
                marginBottom: 4
              }}>
                Reprogramada para el 16 de Julio
              </AppText>
              <AppText style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.typography.bodySmall 
              }}>
                OT-2024-00125
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

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
        
        {/* Notificaciones - Activo */}
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            position: 'relative'
          }}>
            <Icon name="notifications" color={theme.colors.warning} size={24} />
            {/* Badge de notificación */}
            <View style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.colors.urgent
            }} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.warning, fontWeight: '600' }}>
            Notificaciones
          </AppText>
        </View>
        
        {/* Ajustes */}
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4
          }}>
            <Icon name="settings" color={theme.colors.textSecondary} size={24} />
          </View>
          <AppText style={{ fontSize: theme.typography.caption, color: theme.colors.textSecondary }}>
            Ajustes
          </AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
