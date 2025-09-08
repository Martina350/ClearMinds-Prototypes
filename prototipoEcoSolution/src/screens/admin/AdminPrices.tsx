import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { AppIcons } from '../../components/Icon';
import { db, updateServicePrice } from '../../data/database';

interface AdminPricesProps { onTabPress: (tab: string) => void; }

export const AdminPrices: React.FC<AdminPricesProps> = ({ onTabPress }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const services = db.services;

  const edit = (id: string) => {
    const s = services.find(ss => ss.id === id);
    if (!s) return;
    updateServicePrice(id, s.price + 10);
    setRefreshKey(k => k + 1);
  };

  return (
    <View style={styles.container} key={refreshKey}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>{AppIcons.gear(16, colors.textWhite)}<Text style={styles.headerTitle}>Panel Administrativo</Text></View>
        <View style={styles.headerRight}>{AppIcons.bell(16, colors.textWhite)}{AppIcons.refresh(16, colors.textWhite)}{AppIcons.mobile(14, colors.textWhite)}</View>
      </View>

      <AdminTabs active={'prices'} onTabPress={onTabPress as any} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gestión de Precios</Text>
        {services.map(s => (
          <Card key={s.id} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceCountry}>{s.country} - ${s.price}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => edit(s.id)}>
                <Text style={styles.editTxt}>EDITAR PRECIO</Text>
              </TouchableOpacity>
            </View>
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
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  serviceName: { ...typography.h4 },
  serviceCountry: { ...typography.bodySmall, color: colors.textSecondary },
  editBtn: { backgroundColor: colors.success, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md },
  editTxt: { ...typography.body, color: colors.textWhite },
});


