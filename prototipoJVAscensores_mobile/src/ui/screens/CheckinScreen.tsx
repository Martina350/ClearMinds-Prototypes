import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getOtById } from '../../infra/mock/mockApi';
import { haversineMeters } from '../../domain/geo';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText, Subtitle } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

const RADIUS_METERS_DEFAULT = 100;

export function CheckinScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { otId } = route.params ?? {};
  const { dispatchEvent, isDark } = useAppState();
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const theme = getTheme(isDark ? 'dark' : 'light');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCoords(loc.coords);
    })();
  }, []);

  const ot = getOtById(otId);
  const distanceToSite = coords && ot?.lat && ot?.lon ? haversineMeters(coords.latitude, coords.longitude, ot.lat, ot.lon) : Infinity;
  const inside = distanceToSite <= RADIUS_METERS_DEFAULT;

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

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl }}>
        {/* Icono de ubicación */}
        <View style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 40, 
          backgroundColor: theme.colors.primary + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.xl
        }}>
          <Icon name="place" color={theme.colors.primary} size={40} />
        </View>

        {/* Texto de distancia */}
        <AppText style={{ 
          fontSize: theme.typography.h1, 
          fontWeight: '700', 
          textAlign: 'center',
          marginBottom: theme.spacing.sm
        }}>
          Estás a {Math.round(distanceToSite)} metros
        </AppText>
        
        <Subtitle style={{ 
          fontSize: theme.typography.body,
          textAlign: 'center',
          marginBottom: theme.spacing.xl
        }}>
          de la ubicación de la OT
        </Subtitle>

        {/* Información de precisión */}
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radii.md,
          padding: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.xl,
          ...theme.shadows.sm
        }}>
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme.colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md
          }}>
            <Icon name="my-location" color={theme.colors.primary} size={16} />
          </View>
          <AppText style={{ color: theme.colors.textSecondary }}>
            Precisión: {coords?.accuracy ? Math.round(coords.accuracy) : 0} metros
          </AppText>
        </View>

        {/* Botón principal */}
        <AppButton
          title="Llegué"
          onPress={() => {
            if (coords) {
              dispatchEvent({ type: 'CHECK_IN', otId, lat: coords.latitude, lon: coords.longitude, accuracy: coords.accuracy ?? undefined });
            }
            navigation.navigate('Checklist', { otId });
          }}
          variant="success"
          size="lg"
          style={{ 
            width: '100%',
            paddingVertical: theme.spacing.lg,
            ...theme.shadows.md
          }}
        />

        {/* Botón de override si está fuera del radio */}
        {!inside && (
          <View style={{ marginTop: theme.spacing.lg, width: '100%' }}>
            <AppButton
              title="Override (prototipo)"
              onPress={() => {
                if (!coords) return;
                const reason = 'Override prototipo';
                dispatchEvent({ type: 'CHECK_IN', otId, lat: coords.latitude, lon: coords.longitude, accuracy: coords.accuracy ?? undefined, overrideReason: reason });
                navigation.navigate('Checklist', { otId });
              }}
              variant="danger"
              icon="report-problem"
              style={{ width: '100%' }}
            />
          </View>
        )}

        {/* Mensaje de error */}
        {errorMsg && (
          <AppText style={{ 
            color: theme.colors.danger, 
            textAlign: 'center',
            marginTop: theme.spacing.lg
          }}>
            {errorMsg}
          </AppText>
        )}
      </View>
    </Screen>
  );
}


