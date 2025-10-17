import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme/theme';
import { Card } from '../components/Card';
import { MaterialIcons } from '@expo/vector-icons';

export const ActividadScreen: React.FC = () => {
  const kpis = {
    cuentas: 5,
    depositos: { cantidad: 12, monto: 850 },
    cobros: { cantidad: 8, monto: 400 },
    total: 1250,
  };

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
        <Text style={styles.title}>Dashboard de Actividad</Text>
        <Text style={styles.subtitle}>Resumen de transacciones del día</Text>

      <View style={styles.grid}> 
        <View style={[styles.tile, styles.tileBeige]}> 
          <Text style={styles.tileTitle}>Cuentas{`\n`}Aperturadas</Text>
          <Text style={styles.tileValue}>{kpis.cuentas}</Text>
        </View>
        <View style={[styles.tile, styles.tileBeige]}> 
          <Text style={styles.tileTitle}>Depósitos</Text>
          <Text style={styles.tileMini}>{kpis.depositos.cantidad} trans.</Text>
          <Text style={[styles.tileMoney, { color: theme.colors.primary }]}>${kpis.depositos.monto.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.grid}> 
        <View style={[styles.tile, styles.tileBeige]}> 
          <Text style={styles.tileTitle}>Cobros</Text>
          <Text style={styles.tileMini}>{kpis.cobros.cantidad} trans.</Text>
          <Text style={[styles.tileMoney, { color: theme.colors.primary }]}>${kpis.cobros.monto.toFixed(2)}</Text>
        </View>
        <View style={[styles.tile, styles.tileRed]}> 
          <Text style={[styles.tileTitle, { color: '#fff' }]}>Monto total{`\n`}recaudado</Text>
          <Text style={[styles.tileMoney, { color: '#fff', fontSize: 28 }]}>${kpis.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.cardWhite}>
        <Text style={styles.section}>Historial Detallado</Text>
        {[
          { icon: 'person-add-alt', bg: '#E7F7EA', title: 'Apertura de Cuentas', c: 5, m: 60 },
          { icon: 'account-balance-wallet', bg: '#E8F0FE', title: 'Depósitos', c: 12, m: 850 },
          { icon: 'receipt-long', bg: '#FFF3E0', title: 'Cobros', c: 8, m: 400 },
        ].map((i, idx) => (
          <View key={idx} style={styles.histRow}>
            <View style={[styles.circle, { backgroundColor: i.bg }]}> 
              <MaterialIcons name={i.icon as any} size={24} color={theme.colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{i.title}</Text>
              <Text style={styles.rowSub}>{i.c} transacciones</Text>
            </View>
            <Text style={styles.rowAmount}>${i.m.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionBig}>Resumen General</Text>
      <View style={[styles.tileBeige, styles.consolidado]}>
        <View style={styles.consRow}>
          <Text style={styles.consLabel}>Cantidad de Cuentas Aperturadas</Text>
          <Text style={styles.consValue}>{kpis.cuentas}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.consRow}>
          <Text style={styles.consLabel}>Monto por Depósitos</Text>
          <Text style={styles.consValue}>${kpis.depositos.monto.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.consRow}>
          <Text style={styles.consLabel}>Monto por Cobros</Text>
          <Text style={styles.consValue}>${kpis.cobros.monto.toFixed(2)}</Text>
        </View>
        <View style={[styles.divider, styles.dividerRed]} />
        <View style={styles.consRow}>
          <Text style={[styles.consLabel, styles.totalGeneralText]}>Total General</Text>
          <Text style={[styles.consValue, styles.totalGeneralText]}>${kpis.total.toFixed(2)}</Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 6, paddingBottom: 6, backgroundColor: theme.colors.background },
  topTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  scrollContent: { padding: 16, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.primary, textAlign: 'center' },
  logo: { width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center' },
  subtitle: { textAlign: 'center', color: theme.colors.subtitle, marginTop: 4, marginBottom: theme.spacing.lg },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
  tile: { flex: 1, marginHorizontal: 6, borderRadius: 20, paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.md, ...theme.shadows.card },
  tileBeige: { backgroundColor: '#FFFFFF' },
  tileRed: { backgroundColor: theme.colors.primary },
  tileTitle: { color: theme.colors.text, fontWeight: '900' },
  tileMini: { color: theme.colors.subtitle, marginTop: 6, fontWeight: '700' },
  tileValue: { color: theme.colors.primary, fontSize: 28, fontWeight: '900', position: 'absolute', right: 16, bottom: 14 },
  tileMoney: { fontSize: 24, fontWeight: '900', marginTop: 6 },
  cardWhite: { backgroundColor: theme.colors.background, borderRadius: 20, padding: theme.spacing.lg, ...theme.shadows.card, marginBottom: theme.spacing.lg },
  section: { fontSize: 22, fontWeight: '900', color: theme.colors.text, marginBottom: theme.spacing.md },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  rowTitle: { fontWeight: '900', color: theme.colors.text },
  rowSub: { color: theme.colors.subtitle, marginTop: 2 },
  rowAmount: { fontWeight: '900', color: theme.colors.text },
  sectionBig: { fontSize: 24, fontWeight: '900', color: theme.colors.text, marginBottom: theme.spacing.md },
  consolidado: { borderRadius: 20, padding: theme.spacing.lg, ...theme.shadows.card },
  consRow: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EADCCC' },
  dividerRed: { backgroundColor: theme.colors.primary, height: 2, marginTop: 4 },
  consLabel: { color: theme.colors.text, fontWeight: '900' },
  consValue: { color: theme.colors.text, fontWeight: '900' },
  totalGeneralText: { color: theme.colors.primary },
});


