import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const CobrosScreen: React.FC<Props> = ({ navigation }) => {
  const [busqueda, setBusqueda] = useState('');
  const deudas = [
    { nombre: 'Juan Pérez', cedula: '123456789', monto: 500, avatar: 'https://dummyimage.com/120x90/e0f2f1/ffffff&text=🧑' },
    { nombre: 'María Gómez', cedula: '987654321', monto: 300, avatar: 'https://dummyimage.com/120x90/ffecb3/ffffff&text=👩' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Input label="Buscar por cédula, nombre o número de cuenta" placeholder="Buscar por cédula, nombre o número d" value={busqueda} onChangeText={setBusqueda} />

      <Text style={styles.section}>Deudas Pendientes</Text>
      {deudas.map((d, idx) => (
        <View key={idx} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{d.nombre}</Text>
            <Text style={styles.sub}>Cédula: {d.cedula}</Text>
            <View style={styles.pill}><Text style={styles.pillText}>${d.monto}</Text></View>
          </View>
          <Image source={{ uri: d.avatar }} style={styles.thumb} />
        </View>
      ))}

      <Button title="Registrar Cobro" onPress={() => navigation.navigate('Recibo')} fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  section: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginVertical: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.card },
  name: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  sub: { color: theme.colors.primaryLight, marginTop: 4 },
  pill: { backgroundColor: '#F5EAEA', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16, marginTop: theme.spacing.sm, alignSelf: 'flex-start' },
  pillText: { color: theme.colors.text, fontWeight: '700' },
  thumb: { width: 100, height: 80, borderRadius: theme.radii.md },
});


