import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const AperturaBasicaScreen: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [fecha, setFecha] = useState('');
  const [refNombre, setRefNombre] = useState('');
  const [refTel, setRefTel] = useState('');
  const [refRel, setRefRel] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cuenta de Ahorro Básica</Text>

      <Input label="Nombres y Apellidos" placeholder="Ingrese su nombre completo" value={nombre} onChangeText={setNombre} />
      <Input label="Número de Cédula" placeholder="Ingrese su número de cédula" value={cedula} onChangeText={setCedula} />
      <Input label="Dirección" placeholder="Ingrese su dirección" value={direccion} onChangeText={setDireccion} />
      <Input label="Número de Celular" placeholder="Ingrese su número de celular" value={celular} onChangeText={setCelular} />
      <Input label="Fecha de Nacimiento" placeholder="Seleccione su fecha de nacimiento" value={fecha} onChangeText={setFecha} />

      <Text style={styles.section}>Referencias Personales</Text>
      <Input label="Nombre" placeholder="Nombre de la referencia" value={refNombre} onChangeText={setRefNombre} />
      <Input label="Teléfono" placeholder="Teléfono de la referencia" value={refTel} onChangeText={setRefTel} />
      <Input label="Relación" placeholder="Relación con la referencia" value={refRel} onChangeText={setRefRel} />

      <View style={{ height: theme.spacing.lg }} />
      <Button title="Guardar" onPress={() => navigation.goBack()} fullWidth />
      <View style={{ height: theme.spacing.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  content: { padding: theme.spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.md },
  section: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
});


