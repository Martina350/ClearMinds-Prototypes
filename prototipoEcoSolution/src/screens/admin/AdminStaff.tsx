import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { AppIcons } from '../../components/Icon';
import { db, updateStaffStatus, addStaff } from '../../data/database';

interface AdminStaffProps { onTabPress: (tab: string) => void; }

export const AdminStaff: React.FC<AdminStaffProps> = ({ onTabPress }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const staff = db.staff;

  const toggle = (id: number) => {
    const s = db.staff.find(st => st.id === id);
    if (!s) return;
    updateStaffStatus(id, s.status === 'available' ? 'occupied' : 'available');
    setRefreshKey(x => x + 1);
  };

  const add = () => {
    addStaff({ name: 'Nuevo Técnico', phone: '+000', email: 'nuevo@correo.com', zone: 'Quito', status: 'available', services: ['s1'] });
    setRefreshKey(x => x + 1);
  };

  return (
    <View style={styles.container} key={refreshKey}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>{AppIcons.gear(16, colors.textWhite)}<Text style={styles.headerTitle}>Panel Administrativo</Text></View>
        <View style={styles.headerRight}>{AppIcons.bell(16, colors.textWhite)}{AppIcons.refresh(16, colors.textWhite)}{AppIcons.mobile(14, colors.textWhite)}</View>
      </View>

      <AdminTabs active={'staff'} onTabPress={onTabPress as any} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gestión de Personal</Text>

        <TouchableOpacity style={styles.addBtn} onPress={add}><Text style={styles.addBtnText}>AGREGAR PERSONAL</Text></TouchableOpacity>

        {staff.map(s => (
          <Card key={s.id} style={styles.card}>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.info}>{s.zone} | {s.status === 'available' ? 'Disponible' : 'Ocupado'}</Text>
            <Text style={styles.info}>Servicios: {s.services.join(', ')}</Text>
            <TouchableOpacity style={styles.toggleBtn} onPress={() => toggle(s.id)}>
              <Text style={styles.toggleBtnText}>{s.status === 'available' ? 'MARCAR OCUPADO' : 'MARCAR DISPONIBLE'}</Text>
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
  name: { ...typography.h4 },
  info: { ...typography.bodySmall, color: colors.textSecondary },
  toggleBtn: { alignSelf: 'flex-start', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.sm },
  toggleBtnText: { ...typography.body, color: colors.primary },
});


