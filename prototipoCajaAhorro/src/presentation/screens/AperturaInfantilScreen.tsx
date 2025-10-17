import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const AperturaInfantilScreen: React.FC<Props> = ({ navigation }) => {
  const [solNombre, setSolNombre] = useState('');
  const [solCedula, setSolCedula] = useState('');
  const [solDireccion, setSolDireccion] = useState('');
  const [solCelular, setSolCelular] = useState('');
  const [solNacimiento, setSolNacimiento] = useState('');
  const [refs, setRefs] = useState('');
  const [menorNombre, setMenorNombre] = useState('');
  const [menorCedula, setMenorCedula] = useState('');
  const [menorNacimiento, setMenorNacimiento] = useState('');
  const [adultoNombre, setAdultoNombre] = useState('');
  const [adultoCedula, setAdultoCedula] = useState('');
  const [relacion, setRelacion] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Text style={styles.header}>Datos del Solicitante</Text>
      <Input label="Nombres y Apellidos" placeholder="Ingresa tu nombre completo" value={solNombre} onChangeText={setSolNombre} />
      <Input label="Número de Cédula" placeholder="Ingresa tu número de cédula" value={solCedula} onChangeText={setSolCedula} />
      <Input label="Dirección" placeholder="Ingresa tu dirección" value={solDireccion} onChangeText={setSolDireccion} />
      <Input label="Número de Celular" placeholder="Ingresa tu número de celular" value={solCelular} onChangeText={setSolCelular} />
      <Input label="Fecha de Nacimiento" placeholder="Selecciona tu fecha de nacimiento" value={solNacimiento} onChangeText={setSolNacimiento} />
      <Input label="Referencias Personales" placeholder="Ingresa referencias personales" value={refs} onChangeText={setRefs} />

      <Text style={styles.header}>Datos del Menor</Text>
      <Input label="Nombre del Menor" placeholder="Ingresa el nombre del menor" value={menorNombre} onChangeText={setMenorNombre} />
      <Input label="Fecha de Nacimiento del Menor" placeholder="Selecciona la fecha de nacimiento del menor" value={menorNacimiento} onChangeText={setMenorNacimiento} />
      <Input label="Cédula/ID del Menor" placeholder="Ingresa la cédula/ID del menor" value={menorCedula} onChangeText={setMenorCedula} />

      <Text style={styles.header}>Datos del Adulto Responsable</Text>
      <Input label="Nombre del Adulto Responsable" placeholder="Ingresa el nombre del adulto responsable" value={adultoNombre} onChangeText={setAdultoNombre} />
      <Input label="Cédula/ID del Adulto Responsable" placeholder="Ingresa la cédula/ID del adulto responsable" value={adultoCedula} onChangeText={setAdultoCedula} />
      <Input label="Relación" placeholder="Ingresa la relación con el menor" value={relacion} onChangeText={setRelacion} />

      <Button title="Guardar" onPress={() => navigation.goBack()} fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
});


