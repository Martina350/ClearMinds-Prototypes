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
        <View style={{ height: theme.spacing.lg }} />
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 6, paddingBottom: 6, backgroundColor: theme.colors.background },
  topTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.primary, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: theme.colors.subtitle, marginTop: 4 },
  scrollContent: { padding: 16, paddingBottom: 24 }, 
  sectionTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.text },
  logo: { width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center' },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    ...theme.shadows.card,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
    marginRight: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: theme.colors.subtitle,
    lineHeight: 18,
  },
});

