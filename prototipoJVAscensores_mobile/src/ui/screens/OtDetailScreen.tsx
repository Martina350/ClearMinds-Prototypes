import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getOtById } from '../../infra/mock/mockApi';
import { Linking } from 'react-native';
import { Screen } from '../components/Screen';
import { Title, AppText, Subtitle } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OtDetail'>;

export function OtDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<Nav>();
  const { otId } = route.params ?? { otId: 'OT-1001' };
  const ot = getOtById(otId);
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

      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        {/* Información del cliente */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.md }}>
            Información del cliente
          </Title>
          
          <View style={{ 
            height: 1, 
            backgroundColor: theme.colors.border, 
            marginBottom: theme.spacing.md 
          }} />
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <AppText style={{ color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall }}>
              Cliente
            </AppText>
            <AppText style={{ fontWeight: '600', marginTop: 4 }}>Juan Pérez</AppText>
          </View>
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <AppText style={{ color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall }}>
              Edificio
            </AppText>
            <AppText style={{ fontWeight: '600', marginTop: 4 }}>{ot?.edificio}</AppText>
          </View>
          
          <View style={{ marginBottom: theme.spacing.lg }}>
            <AppText style={{ color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall }}>
              Ubicación
            </AppText>
            <AppText style={{ fontWeight: '600', marginTop: 4 }}>Calle 123, #45-67</AppText>
          </View>
          
          <AppButton 
            title="Abrir en mapas" 
            onPress={() => {
              if (ot?.lat && ot?.lon) {
                const url = `https://www.google.com/maps/search/?api=1&query=${ot.lat},${ot.lon}`;
                Linking.openURL(url);
              }
            }} 
            icon="map"
            style={{ width: '100%' }}
          />
        </Card>

        {/* Detalles de la OT */}
        <Card style={{ marginBottom: theme.spacing.xl }}>
          <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.md }}>
            Detalles de la OT
          </Title>
          
          <View style={{ 
            height: 1, 
            backgroundColor: theme.colors.border, 
            marginBottom: theme.spacing.md 
          }} />
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="access-time" color={theme.colors.textSecondary} size={20} style={{ marginRight: 8 }} />
              <AppText style={{ color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall }}>
                Ventana de atención
              </AppText>
            </View>
            <AppText style={{ fontWeight: '600', marginLeft: 28 }}>
              {ot?.ventana}
            </AppText>
          </View>
          
          <View style={{ marginBottom: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="hourglass-empty" color={theme.colors.textSecondary} size={20} style={{ marginRight: 8 }} />
              <AppText style={{ color: theme.colors.textSecondary, fontSize: theme.typography.bodySmall }}>
                Duración estimada
              </AppText>
            </View>
            <AppText style={{ fontWeight: '600', marginLeft: 28 }}>
              {Math.floor(ot?.durEstimadaMin || 0 / 60)} horas {(ot?.durEstimadaMin || 0) % 60} minutos
            </AppText>
          </View>
        </Card>

        {/* Botones de acción */}
        <View style={{ 
          flexDirection: 'row', 
          gap: theme.spacing.md,
          paddingBottom: theme.spacing.xl
        }}>
          <AppButton 
            title="Rechazar" 
            onPress={() => navigation.goBack()} 
            variant="outline"
            style={{ flex: 1 }}
          />
          <AppButton 
            title="Aceptar" 
            onPress={() => navigation.navigate('Checkin', { otId })} 
            variant="success"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Screen>
  );
}


