import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { AppIcons } from './Icon';

type AdminTabKey = 'admin' | 'services' | 'payments' | 'calendar' | 'zones' | 'staff' | 'prices';

interface AdminTabsProps {
  active: AdminTabKey;
  onTabPress: (tab: AdminTabKey) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ active, onTabPress }) => {
  const tabs: { key: AdminTabKey; label: string; icon: (size?: number, color?: string) => JSX.Element }[] = [
    { key: 'admin', label: 'Dashboard', icon: AppIcons.dashboard },
    { key: 'services', label: 'Servicios', icon: AppIcons.services },
    { key: 'payments', label: 'Pagos', icon: AppIcons.creditCard },
    { key: 'calendar', label: 'Calendario', icon: AppIcons.calendar },
    { key: 'zones', label: 'Zonas', icon: AppIcons.mapPin },
    { key: 'staff', label: 'Personal', icon: AppIcons.users },
    { key: 'prices', label: 'Precios', icon: AppIcons.creditCard },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navigation} contentContainerStyle={styles.navContent}>
      {tabs.map(t => (
        <TouchableOpacity
          key={t.key}
          style={[styles.tab, active === t.key && styles.activeTab]}
          onPress={() => onTabPress(t.key)}
        >
          {t.icon(16, colors.textWhite)}
          <Text style={styles.tabText}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  navigation: {
    
    backgroundColor: colors.adminHeader,
    paddingVertical: 10,
    marginVertical: 0,
    maxHeight: '6%',
    paddingHorizontal: spacing.xs,
   height: 32,
  },
  navContent: {
    alignItems: 'center',
    paddingVertical: 0,
    marginVertical: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.adminTabActive,
    borderBottomLeftRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textWhite,
    marginLeft: spacing.xs,
  },
});


