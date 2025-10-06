import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getOtsToday } from '../../infra/mock/mockApi';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { FilterButton } from '../components/FilterButton';
import { OtCard } from '../components/OtCard';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const data = getOtsToday();
  const { banner, clearBanner, triggerEmergency, triggerReprogram, isDark } = useAppState();
  const [activeFilter, setActiveFilter] = useState<'PROGRAMADA' | 'EN_CURSO' | 'SUSPENDIDA'>('PROGRAMADA');
  const theme = getTheme(isDark ? 'dark' : 'light');
  
  const filteredData = data.filter(ot => ot.estado === activeFilter);
  
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
        <TouchableOpacity style={{ marginRight: theme.spacing.md }}>
          <Icon name="menu" color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Title style={{ flex: 1, textAlign: 'center' }}>Ruta del Día</Title>
      </View>

      {/* Banner de notificaciones */}
      {banner && (
        <View style={{ 
          backgroundColor: banner.type === 'EMERGENCIA' ? theme.colors.urgent : theme.colors.warning,
          marginHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          padding: theme.spacing.md,
          borderRadius: theme.radii.md
        }}>
          <AppText style={{ color: theme.colors.card, marginBottom: theme.spacing.sm }}>
            {banner.message}
          </AppText>
          <AppButton title="Ocultar" onPress={clearBanner} variant="outline" icon="close" size="sm" />
        </View>
      )}

      {/* Mapa */}
      <View style={{ 
        height: 240, 
        marginHorizontal: theme.spacing.lg, 
        marginBottom: theme.spacing.lg,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
        ...theme.shadows.md
      }}>
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{ html: `<!doctype html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\"/></head><body style='margin:0'><div id=\"map\" style=\"width:100%;height:100vh\"></div><script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script><script>var ots=${JSON.stringify(data)};var center=([-0.1807,-78.4678]);if(ots.length&&ots[0].lat&&ots[0].lon){center=[ots[0].lat,ots[0].lon];}var map=L.map('map').setView(center,12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);ots.forEach(function(ot){if(ot.lat&&ot.lon){L.marker([ot.lat,ot.lon]).addTo(map).bindPopup(ot.id+' - '+ot.edificio);}});</script></body></html>` }}
        />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Título de Órdenes de Trabajo */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }}>
          <Title>Órdenes de Trabajo</Title>
        </View>

        {/* Filtros */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: theme.spacing.lg, 
          marginBottom: theme.spacing.lg 
        }}>
          <FilterButton 
            title="Programada" 
            active={activeFilter === 'PROGRAMADA'} 
            onPress={() => setActiveFilter('PROGRAMADA')} 
          />
          <FilterButton 
            title="En curso" 
            active={activeFilter === 'EN_CURSO'} 
            onPress={() => setActiveFilter('EN_CURSO')} 
          />
          <FilterButton 
            title="Suspendida" 
            active={activeFilter === 'SUSPENDIDA'} 
            onPress={() => setActiveFilter('SUSPENDIDA')} 
          />
        </View>

        {/* Lista de OTs */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          {filteredData.map((ot) => (
            <OtCard
              key={ot.id}
              id={ot.id}
              edificio={ot.edificio}
              ventana={ot.ventana}
              durEstimadaMin={ot.durEstimadaMin}
              estado={ot.estado}
              onPress={() => navigation.navigate('OtDetail', { otId: ot.id })}
            />
          ))}
        </View>

        {/* Botones de acción */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: theme.spacing.lg, 
          marginVertical: theme.spacing.lg,
          gap: theme.spacing.md
        }}>
          <AppButton 
            title="Optimizar propuesto" 
            onPress={() => {}} 
            variant="secondary" 
            style={{ flex: 1 }}
          />
          <AppButton 
            title="Filtros" 
            onPress={() => {}} 
            variant="success" 
            style={{ flex: 0.6 }}
          />
        </View>

        {/* Botones de simulación */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <AppButton 
            title="Simular EMERGENCIA" 
            onPress={() => {
              const id = triggerEmergency();
              navigation.navigate('OtDetail', { otId: id });
            }} 
            variant="danger"
            icon="warning"
            style={{ marginBottom: theme.spacing.sm }}
          />
          {data[1] && (
            <AppButton 
              title={`Simular REPROG: priorizar ${data[1].id}`} 
              onPress={() => triggerReprogram(data[1].id)} 
              variant="outline" 
              icon="schedule"
              style={{ marginBottom: theme.spacing.sm }}
            />
          )}
          <AppButton 
            title="Historial del día" 
            onPress={() => navigation.navigate('History')} 
            variant="outline" 
            icon="history"
            style={{ marginBottom: theme.spacing.sm }}
          />
          <AppButton 
            title="Ajustes" 
            onPress={() => navigation.navigate('Settings')} 
            variant="outline" 
            icon="settings"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}


