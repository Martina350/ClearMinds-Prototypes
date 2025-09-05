import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Card } from '../../components/Card';
import { AppIcons } from '../../components/Icon';
import { getUserBookings } from '../../data/database';

interface MyServicesScreenProps {
  user: any;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onPhonePress: () => void;
  onTabPress: (tab: string) => void;
}

export const MyServicesScreen: React.FC<MyServicesScreenProps> = ({
  user,
  onNotificationPress,
  onProfilePress,
  onPhonePress,
  onTabPress
}) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  
  // Validate user exists and has id
  if (!user || !user.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Usuario no encontrado</Text>
      </View>
    );
  }
  
  const bookings = getUserBookings(user.id);
  
  const tabs = [
    { id: 'services', label: 'Servicios', icon: AppIcons.services, activeIcon: AppIcons.services },
    { id: 'myServices', label: 'Mis Servicios', icon: AppIcons.myServices, activeIcon: AppIcons.myServicesActive },
    { id: 'profile', label: 'Perfil', icon: AppIcons.profile, activeIcon: AppIcons.profileActive }
  ];

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
        return 'CONFIRMADO';
      case 'pendiente':
        return 'PENDIENTE';
      case 'completado':
        return 'COMPLETADO';
      case 'cancelado':
        return 'CANCELADO';
      default:
        return status.toUpperCase();
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Pendientes') return booking.status === 'pendiente';
    if (activeFilter === 'Confirmados') return booking.status === 'confirmado';
    if (activeFilter === 'Completados') return booking.status === 'completado';
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        onNotificationPress={onNotificationPress}
        onProfilePress={onProfilePress}
        onPhonePress={onPhonePress}
        notificationCount={0}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mis Servicios</Text>
        
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
        
        {/* Bookings List */}
        {filteredBookings.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
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
            
            <View style={styles.bookingDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Fecha: </Text>
                {booking.date}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Hora: </Text>
                {booking.time}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Tipo: </Text>
                {booking.clientType === 'casa' ? 'Casa' : 'Empresa'}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Pago: </Text>
                {booking.payment.method === 'card' ? 'Tarjeta' : 'Transferencia'} - {booking.payment.status}
              </Text>
            </View>
          </Card>
        ))}
        
        {filteredBookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes servicios {activeFilter.toLowerCase()}</Text>
          </View>
        )}
      </ScrollView>
      
      <BottomNavigation
        tabs={tabs}
        activeTab="myServices"
        onTabPress={onTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    ...typography.h2,
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
  bookingCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  bookingHeader: {
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
  bookingDetails: {
    gap: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
