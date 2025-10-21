import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
}

/**
 * Pantalla principal con menú de opciones
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const services = [
    {
      title: 'Apertura de Cuentas',
      subtitle: 'Abre cuentas bancarias de forma rápida y segura',
      icon: 'person-add-alt',
      onPress: () => navigation.navigate('AperturaCuentas'),
    },
    {
      title: 'Depósitos',
      subtitle: 'Realiza depósitos en tus cuentas desde cualquier lugar',
      icon: 'account-balance-wallet',
      onPress: () => navigation.navigate('Depositos'),
    },
    {
      title: 'Cobros',
      subtitle: 'Gestiona tus cobros de manera eficiente y sin complicaciones',
      icon: 'receipt-long',
      onPress: () => navigation.navigate('Cobros'),
    },
    {
      title: 'Consultas de Clientes',
      subtitle: 'Accede a la información de tus clientes de forma segura',
      icon: 'search',
      onPress: () => navigation.navigate('Consultas'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7}>
        </TouchableOpacity>
        { <View style={{ alignSelf: 'center' }}>
          <Image
            source={require('../assets/logoSantaTeresita2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View> }
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nuestros Servicios</Text>
        <Text style={styles.subtitle}>Selecciona el servicio que deseas realizar</Text>
        <View style={styles.servicesContainer}>
          {services.map((service, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.serviceItem} 
            onPress={service.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.serviceIcon}>
              <MaterialIcons name={service.icon as any} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.border} />
          </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundApp 
  },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: theme.spacing.md, 
    paddingTop: theme.spacing.lg, 
    paddingBottom: theme.spacing.lg, 
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  topTitle: { 
    fontSize: theme.typography.sizes.lg, 
    fontWeight: theme.typography.weights.extrabold, 
    color: theme.colors.text 
  },
  title: { 
    fontSize: theme.typography.sizes.xxxl, 
    fontWeight: theme.typography.weights.black, 
    color: theme.colors.primary, 
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: { 
    textAlign: 'center', 
    color: theme.colors.subtitle, 
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
  },
  scrollContent: { 
    padding: theme.spacing.xl, 
    paddingBottom: theme.spacing.xxl, 
    flexGrow: 1 
  }, 
  sectionTitle: { 
    fontSize: theme.typography.sizes.xxl, 
    fontWeight: theme.typography.weights.extrabold, 
    color: theme.colors.text 
  },
  logo: { 
    width: 340, 
    height: 36, 
    resizeMode: 'contain', 
    alignSelf: 'center' 
  },
  servicesContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    ...theme.shadows.card,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.backgroundApp,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  serviceContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  serviceTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.2,
  },
  serviceSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    lineHeight: theme.typography.lineHeights.normal * theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.regular,
  },
});

