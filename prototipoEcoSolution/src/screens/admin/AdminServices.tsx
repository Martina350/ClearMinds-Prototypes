import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Card } from '../../components/Card';
import { AdminTabs } from '../../components/AdminTabs';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';
import { getAdminBookings } from '../../data/database';

interface AdminServicesProps {
  onTabPress: (tab: string) => void;
  onLogout: () => void;
}

export const AdminServices: React.FC<AdminServicesProps> = ({
  onTabPress,
  onLogout
}) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const bookings = getAdminBookings();

  const filters = ['Todos', 'Pendientes', 'Confirmados', 'Completados'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return colors.statusConfirmed;
      case 'pendiente':
        return colors.statusPending;
      case 'completado':
        return colors.statusCompleted;
      case 'cancelado':
        return colors.statusCancelled;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'confirmado';
      case 'pendiente':
        return 'pendiente';
      case 'completado':
        return 'completado';
      case 'cancelado':
        return 'cancelado';
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Pendientes') return booking.status === 'pendiente';
    if (activeFilter === 'Confirmados') return booking.status === 'confirmado';
    if (activeFilter === 'Completados') return booking.status === 'completado';
    return true;
  });

  const handleViewDetails = (booking: any) => {
    // Implementar navegación a detalles
    console.log('Ver detalles:', booking);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
      <AdminTabs active={'services'} onTabPress={onTabPress as any} />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gestión de Servicios</Text>
        
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter && styles.filterTabTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services List */}
        {filteredBookings.map((booking) => (
          <Card key={booking.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceName}>{booking.service?.name}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(booking.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusText(booking.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.serviceDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Cliente: </Text>
                {booking.user?.name}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Fecha: </Text>
                {booking.date} {booking.time}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Estado: </Text>
                {getStatusText(booking.status)}
              </Text>
            </View>
            
            <Button
              title="VER DETALLES"
              onPress={() => handleViewDetails(booking)}
              style={styles.detailsButton}
            />
          </Card>
        ))}
        
        {filteredBookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay servicios {activeFilter.toLowerCase()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  navigation: {
    flexDirection: 'row',
    backgroundColor: colors.adminHeader,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
  },
  activeTab: {
    backgroundColor: colors.adminTabActive,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  tabIcon: {
    fontSize: 16,
    color: colors.textWhite,
    marginRight: spacing.xs,
  },
  tabText: {
    ...typography.adminSubtitle,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  filterTab: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  filterTabTextActive: {
    color: colors.textWhite,
  },
  serviceCard: {
    marginBottom: spacing.md,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceName: {
    ...typography.h4,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.bodySmall,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  serviceDetails: {
    marginBottom: spacing.md,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
