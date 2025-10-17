import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const ReciboScreen: React.FC<Props> = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Text style={styles.title}>Recibo e Impresión</Text>
      <View style={styles.card}>
        <View style={styles.row}><Text style={styles.label}>Cliente</Text><Text style={styles.value}>1234567890</Text></View>
        <View style={styles.row}><Text style={styles.label}>Tipo de Transacción</Text><Text style={styles.value}>Depósito</Text></View>
        <View style={styles.row}><Text style={styles.label}>Monto</Text><Text style={styles.value}>$500.00</Text></View>
        <View style={styles.row}><Text style={styles.label}>Fecha y Hora</Text><Text style={styles.value}>2024-07-26 14:30</Text></View>
      </View>

      <Button title="Imprimir Recibo" onPress={() => {}} fullWidth />
      <View style={{ height: theme.spacing.sm }} />
      <Button title="Enviar por Correo" onPress={() => {}} fullWidth variant="secondary" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.md },
  card: { backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.lg, ...theme.shadows.card, marginBottom: theme.spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  label: { color: theme.colors.text, fontWeight: '800' },
  value: { color: theme.colors.primaryLight, fontWeight: '600' },
});


