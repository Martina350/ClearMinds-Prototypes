import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Card } from '../../components/Card';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';
import { getServicesByCountry } from '../../data/database';

interface ServicesScreenProps {
  user: any;
  onServicePress: (service: any) => void;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onPhonePress: () => void;
  onTabPress: (tab: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  user,
  onServicePress,
  onNotificationPress,
  onProfilePress,
  onPhonePress,
  onTabPress
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Todos los servicios');
  
  // Validate user exists and has country
  if (!user || !user.country) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Usuario no encontrado</Text>
      </View>
    );
  }
  
  const services = getServicesByCountry(user.country);
  
  const tabs = [
    { id: 'services', label: 'Servicios', icon: AppIcons.services, activeIcon: AppIcons.services },
    { id: 'myServices', label: 'Mis Servicios', icon: AppIcons.myServices, activeIcon: AppIcons.myServicesActive },
    { id: 'profile', label: 'Perfil', icon: AppIcons.profile, activeIcon: AppIcons.profileActive }
  ];

  const getServiceIcon = (imageName: string) => {
    switch (imageName) {
      case 'toilet':
        return AppIcons.toilet(48, colors.textWhite);
      case 'septic':
        return AppIcons.septic(48, colors.textWhite);
      case 'grease':
        return AppIcons.grease(48, colors.textWhite);
      case 'trash':
        return AppIcons.trash(48, colors.textWhite);
      case 'debris':
        return AppIcons.debris(48, colors.textWhite);
      default:
        return AppIcons.toilet(48, colors.textWhite);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        onNotificationPress={onNotificationPress}
        onProfilePress={onProfilePress}
        onPhonePress={onPhonePress}
        notificationCount={0}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Nuestros Servicios</Text>
        
        {/* Filter Dropdown */}
        <TouchableOpacity style={styles.filterContainer}>
          <Text style={styles.filterText}>{selectedFilter}</Text>
          <View>
            {AppIcons.eye(16, colors.textSecondary)}
          </View>
        </TouchableOpacity>
        
        {/* Services List */}
        {services.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceImageContainer}>
              {getServiceIcon(service.image)}
            </View>
            
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
              
              <Button
                title="SOLICITAR SERVICIO"
                onPress={() => onServicePress(service)}
                style={styles.requestButton}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
      
      <BottomNavigation
        tabs={tabs}
        activeTab="services"
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  serviceCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  serviceImageContainer: {
    backgroundColor: colors.primary,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 48,
  },
  serviceContent: {
    padding: spacing.md,
  },
  serviceName: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  serviceDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  servicePrice: {
    ...typography.price,
    marginBottom: spacing.md,
  },
  requestButton: {
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
