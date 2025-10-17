import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Input } from '../components/Input';
import { theme } from '../theme/theme';

export const ConsultasClientesScreen: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const resultados = [
    { nombre: 'María Rodríguez', cedula: '1234567890', avatar: 'https://dummyimage.com/80x80/fbe9e7/ffffff&text=👩' },
    { nombre: 'Carlos Pérez', cedula: '0987654321', avatar: 'https://dummyimage.com/80x80/e3f2fd/ffffff&text=👨' },
    { nombre: 'Ana García', cedula: '1122334455', avatar: 'https://dummyimage.com/80x80/fff3e0/ffffff&text=👩' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Input label="Buscar por cédula, nombre o número de cuenta" placeholder="Buscar por cédula, nombre o número d" value={busqueda} onChangeText={setBusqueda} />

      <Text style={styles.header}>Resultados</Text>
      {resultados.map((r, i) => (
        <View key={i} style={styles.item}>
          <Image source={{ uri: r.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: theme.spacing.md }}>
            <Text style={styles.name}>{r.nombre}</Text>
            <Text style={styles.sub}>Cédula: {r.cedula}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginVertical: theme.spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.md, marginBottom: theme.spacing.sm, ...theme.shadows.card },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  sub: { color: theme.colors.primaryLight, marginTop: 2 },
});


