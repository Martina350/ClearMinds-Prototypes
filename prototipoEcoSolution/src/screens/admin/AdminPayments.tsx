import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { AppIcons } from '../../components/Icon';
import { getAdminBookings, updateBookingPaymentStatus } from '../../data/database';

interface AdminPaymentsProps {
  onTabPress: (tab: string) => void;
  onLogout: () => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({ onTabPress }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const bookings = getAdminBookings().filter(b => b.payment?.method === 'transfer');
  const pending = bookings.filter(b => b.payment?.status === 'pending');

  const onViewProof = (b: any) => {
    Alert.alert('Comprobante', b.payment?.proof || 'Sin archivo');
  };

  const changeStatus = (id: string, status: 'approved' | 'rejected') => {
    updateBookingPaymentStatus(id, status);
    setRefreshKey(k => k + 1);
  };

  return (
    <View style={styles.container} key={refreshKey}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {AppIcons.gear(16, colors.textWhite)}
          <Text style={styles.headerTitle}>Panel Administrativo</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>{AppIcons.bell(16, colors.textWhite)}<View style={styles.badge}><Text style={styles.badgeText}>3</Text></View></TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton}>{AppIcons.refresh(16, colors.textWhite)}</TouchableOpacity>
          <TouchableOpacity style={styles.mobileButton}>{AppIcons.mobile(14, colors.textWhite)}</TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <AdminTabs active={'payments'} onTabPress={onTabPress as any} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Validación de Pagos</Text>

        {pending.map(b => (
          <Card key={b.id} style={styles.item}>
            <Text style={styles.client}>{b.user?.name}</Text>
            <Text style={styles.sub}>{b.service?.name} | Transferencia | {b.date}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.statusOk} onPress={() => changeStatus(b.id, 'approved')}>{AppIcons.check(16, colors.textWhite)}</TouchableOpacity>
              <TouchableOpacity style={styles.statusNo} onPress={() => changeStatus(b.id, 'rejected')}>{AppIcons.error(16, colors.textWhite)}</TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.proofBtn} onPress={() => onViewProof(b)}>
              <Text style={styles.proofTxt}>VER COMPROBANTE</Text>
            </TouchableOpacity>
          </Card>
        ))}

        {pending.length === 0 && (
          <View style={styles.empty}><Text style={styles.emptyTxt}>No hay pagos pendientes</Text></View>
        )}
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
  notificationButton: { position: 'relative', marginRight: spacing.md },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.error, borderRadius: 10, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: colors.textWhite, fontSize: 10, fontWeight: 'bold' },
  refreshButton: { marginRight: spacing.md },
  mobileButton: { backgroundColor: colors.success, borderRadius: 14, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  navigation: { flexDirection: 'row', backgroundColor: colors.adminHeader, paddingHorizontal: spacing.xs, paddingVertical: 2, height: 32 },
  navContent: { alignItems: 'center' },
  tab: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingHorizontal: spacing.sm, marginRight: spacing.xs },
  activeTab: { backgroundColor: colors.adminTabActive, borderBottomLeftRadius: borderRadius.sm, borderBottomRightRadius: borderRadius.sm },
  tabText: { ...typography.bodySmall, color: colors.textWhite },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.lg },
  item: { marginBottom: spacing.md },
  client: { ...typography.h4 },
  sub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  statusOk: { backgroundColor: colors.success, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statusNo: { backgroundColor: colors.error, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  proofBtn: { borderWidth: 1, borderColor: colors.success, borderRadius: borderRadius.md, paddingVertical: spacing.sm, alignItems: 'center' },
  proofTxt: { ...typography.body, color: colors.success },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyTxt: { ...typography.body, color: colors.textSecondary },
});


