import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { AppIcons } from '../../components/Icon';
import { db, addZone, setZoneEnabled } from '../../data/database';

interface AdminZonesProps { onTabPress: (tab: string) => void; }

export const AdminZones: React.FC<AdminZonesProps> = ({ onTabPress }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const zones = db.zones;

  const toggle = (country: string, province: string, enabled: boolean) => {
    setZoneEnabled(country, province, enabled);
    setRefreshKey(x => x + 1);
  };

  const add = () => {
    addZone('Ecuador', 'Nueva Zona');
    setRefreshKey(x => x + 1);
  };

  return (
    <View style={styles.container} key={refreshKey}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>{AppIcons.gear(16, colors.textWhite)}<Text style={styles.headerTitle}>Panel Administrativo</Text></View>
        <View style={styles.headerRight}>{AppIcons.bell(16, colors.textWhite)}{AppIcons.refresh(16, colors.textWhite)}{AppIcons.mobile(14, colors.textWhite)}</View>
      </View>

      <AdminTabs active={'zones'} onTabPress={onTabPress as any} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gestión de Zonas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={add}><Text style={styles.addBtnText}>AGREGAR ZONA</Text></TouchableOpacity>

        {zones.map(z => (
          <Card key={`${z.country}-${z.province}`} style={styles.card}>
            <Text style={styles.zoneTitle}>{z.country}</Text>
            <Text style={styles.zoneSub}>{z.province} - {z.enabled ? 'Habilitada' : 'Deshabilitada'}</Text>
            <TouchableOpacity style={[styles.toggleBtn, { borderColor: z.enabled ? colors.buttonSecondary : colors.success }]} onPress={() => toggle(z.country, z.province, !z.enabled)}>
              <Text style={[styles.toggleTxt, { color: z.enabled ? colors.buttonSecondary : colors.success }]}>
                {z.enabled ? 'DESHABILITAR' : 'HABILITAR'}
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.adminHeader, paddingHorizontal: spacing.sm, paddingVertical: 0, height: 36 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { ...typography.adminTitle, fontSize: 16, lineHeight: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  navigation: { flexDirection: 'row', backgroundColor: colors.adminHeader, paddingHorizontal: spacing.xs, paddingVertical: 2, height: 32 },
  navContent: { alignItems: 'center' },
  tab: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingHorizontal: spacing.sm, marginRight: spacing.xs },
  activeTab: { backgroundColor: colors.adminTabActive, borderBottomLeftRadius: borderRadius.sm, borderBottomRightRadius: borderRadius.sm },
  tabText: { ...typography.bodySmall, color: colors.textWhite },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.lg },
  addBtn: { alignSelf: 'flex-start', backgroundColor: colors.success, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.md },
  addBtnText: { ...typography.body, color: colors.textWhite },
  card: { marginBottom: spacing.md },
  zoneTitle: { ...typography.h4 },
  zoneSub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  toggleBtn: { alignSelf: 'flex-start', backgroundColor: colors.background, borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  toggleTxt: { ...typography.body },
});


