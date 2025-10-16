import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const DepositosScreen: React.FC<Props> = ({ navigation }) => {
  const [busqueda, setBusqueda] = useState('');
  const [monto, setMonto] = useState('');
  const [notas, setNotas] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Input label="Buscar por cédula, nombre o número de cuenta" placeholder="Buscar por cédula, nombre o número d" value={busqueda} onChangeText={setBusqueda} />
      <Input label="Monto del depósito" placeholder="" keyboardType="decimal-pad" value={monto} onChangeText={setMonto} />
      <Input label="Notas (opcional)" placeholder="" multiline value={notas} onChangeText={setNotas} />
      <Button title="Realizar Depósito" onPress={() => navigation.navigate('Recibo')} fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
});


