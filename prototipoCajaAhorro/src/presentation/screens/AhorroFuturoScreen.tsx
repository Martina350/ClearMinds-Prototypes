import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

const Periodo = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipText, selected && { color: '#fff' }]}>{label}</Text>
  </TouchableOpacity>
);

export const AhorroFuturoScreen: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [cuenta, setCuenta] = useState('');
  const [periodo, setPeriodo] = useState<'30' | '60' | '90' | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Input label="Buscar cliente por cédula o número de cuenta" placeholder="Buscar cliente por cédula o número de" value={''} editable={false} />
      <Text style={styles.header}>Información del Cliente</Text>
      <Input label="Nombre" placeholder="" value={nombre} onChangeText={setNombre} />
      <Input label="Cédula" placeholder="" value={cedula} onChangeText={setCedula} />
      <Input label="Número de Cuenta" placeholder="" value={cuenta} onChangeText={setCuenta} />

      <Text style={styles.header}>Periodo de Ahorro</Text>
      <View style={styles.row}>
        <Periodo label="30 días" selected={periodo==='30'} onPress={()=>setPeriodo('30')} />
        <Periodo label="60 días" selected={periodo==='60'} onPress={()=>setPeriodo('60')} />
        <Periodo label="90 días" selected={periodo==='90'} onPress={()=>setPeriodo('90')} />
      </View>

      <View style={{ height: theme.spacing.lg }} />
      <Button title="Guardar" onPress={() => navigation.goBack()} fullWidth />
      <View style={{ height: theme.spacing.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { fontSize: 20, fontWeight: '800', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: { borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, backgroundColor: theme.colors.background },
  chipSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.text, fontWeight: '700' },
});


