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
      subtitle: 'Abre cuentas bancarias de forma rápida y segura.',
      cta: 'Abrir',
      image: require('../assets/aperturaCuenta.png'),
      onPress: () => navigation.navigate('AperturaCuentas'),
    },
    {
      title: 'Depósitos',
      subtitle: 'Realiza depósitos en tus cuentas desde cualquier lugar.',
      cta: 'Depo...',
      image: require('../assets/depositos.png'),
      onPress: () => navigation.navigate('Depositos'),
    },
    {
      title: 'Cobros',
      subtitle: 'Gestiona tus cobros de manera eficiente y sin complicaciones.',
      cta: 'Cobrar',
      image: require('../assets/cobros.png'),
      onPress: () => navigation.navigate('Cobros'),
    },
    {
      title: 'Consultas de Clientes',
      subtitle: 'Accede a la información de tus clientes de forma segura.',
      cta: 'Cons...',
      image: require('../assets/consultaClientes.png'),
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
        {services.map((s, idx) => (
          <Card key={idx}>
            <Image source={s.image} style={styles.hero} />
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardSubtitle}>{s.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.pill} onPress={s.onPress} activeOpacity={0.8}>
                <Text style={styles.pillText}>{s.cta}</Text>
              </TouchableOpacity>
            </View>
          </Card>
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
  hero: { width: '100%', height: 160, borderRadius: 12, marginBottom: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 6, marginTop: 6 },
  cardSubtitle: { fontSize: 14, color: theme.colors.subtitle },
  pill: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, ...theme.shadows.card },
  pillText: { color: '#fff', fontWeight: '800' },
});

