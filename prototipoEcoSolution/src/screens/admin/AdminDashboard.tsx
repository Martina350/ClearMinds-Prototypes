import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { AppIcons } from '../../components/Icon';
import { db } from '../../data/database';
import { StatusBar } from 'expo-status-bar';

interface AdminDashboardProps {
  onTabPress: (tab: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onTabPress,
  onLogout
}) => {
  const pendingServices = db.bookings.filter(b => b.status === 'pendiente').length;
  const paymentsToValidate = db.bookings.filter(b => b.payment.status === 'pending').length;
  const weeklySchedule = db.bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return bookingDate >= today && bookingDate <= weekFromNow;
  }).length;
  const activeStaff = db.staff.filter(s => s.status === 'available').length;

  const recentActivities = db.notifications.slice(0, 3);

  const dashboardCards = [
    {
      id: 'pending',
      title: 'Servicios Pendientes',
      value: pendingServices,
      icon: AppIcons.warning,
      color: colors.warning,
      onPress: () => onTabPress('services')
    },
    {
      id: 'payments',
      title: 'Pagos por Validar',
      value: paymentsToValidate,
      icon: AppIcons.creditCard,
      color: colors.error,
      onPress: () => onTabPress('payments')
    },
    {
      id: 'schedule',
      title: 'Agenda Semanal',
      value: weeklySchedule,
      icon: AppIcons.calendar,
      color: colors.info,
      onPress: () => onTabPress('calendar')
    },
    {
      id: 'staff',
      title: 'Personal Activo',
      value: activeStaff,
      icon: AppIcons.users,
      color: colors.success,
      onPress: () => onTabPress('staff')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <StatusBar backgroundColor={colors.adminHeader} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {AppIcons.gear(20, colors.textWhite)}
          <Text style={styles.headerTitle}>Panel Administrativo</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            {AppIcons.bell(20, colors.textWhite)}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.refreshButton}>
            {AppIcons.refresh(20, colors.textWhite)}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mobileButton}>
            {AppIcons.mobile(16, colors.textWhite)}
            <Text style={styles.mobileText}>0</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <AdminTabs active={'admin'} onTabPress={onTabPress as any} />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.dashboardCard}
              onPress={card.onPress}
            >
              <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
                {card.icon(20, colors.textWhite)}
              </View>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>Actividad Reciente</Text>
          
          {recentActivities.map((activity, index) => (
            <Card key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: colors.success }]}>
                {AppIcons.plus(16, colors.textWhite)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityName}>
                  {activity.message.split(' ')[0]} {activity.message.split(' ')[1]}
                </Text>
                <Text style={styles.activityAction}>
                  {activity.message.split(' ').slice(2).join(' ')}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleString('es-ES')}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.adminHeader,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gearIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.adminTitle,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: spacing.md,
  },
  bellIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    marginRight: spacing.md,
  },
  refreshIcon: {
    fontSize: 20,
    color: colors.textWhite,
  },
  mobileButton: {
    backgroundColor: colors.success,
    borderRadius: 4,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mobileIcon: {
    fontSize: 16,
    color: colors.textWhite,
  },
  mobileText: {
    position: 'absolute',
    bottom: 4,
    fontSize: 10,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  dashboardCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardIconText: {
    fontSize: 20,
    color: colors.textWhite,
  },
  cardValue: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    marginTop: spacing.xl,
  },
  activityTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityIconText: {
    fontSize: 16,
    color: colors.textWhite,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  activityAction: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
});
