import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Input, AddressPicker, DatePicker } from '../components';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const AperturaBasicaScreen: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [direccionData, setDireccionData] = useState<any>(null);
  const [celular, setCelular] = useState('+593 ');
  const [fecha, setFecha] = useState('');
  const [refNombre, setRefNombre] = useState('');
  const [refTel, setRefTel] = useState('');
  const [refRel, setRefRel] = useState('');

  const handleCelularChange = (text: string) => {
    // Asegurar que siempre empiece con +593
    if (!text.startsWith('+593')) {
      setCelular('+593 ');
      return;
    }
    
    // Remover espacios y caracteres no numéricos excepto el + al inicio
    const cleanText = text.replace(/[^\d+]/g, '');
    
    // Verificar que solo tenga números después del +593
    if (cleanText.length > 4 && !/^\+\d+$/.test(cleanText)) {
      return;
    }
    
    // Limitar a 10 dígitos después del +593 (total 14 caracteres)
    if (cleanText.length <= 14) {
      // Formatear con espacio después del código de país
      const formatted = cleanText.length > 4 
        ? `+593 ${cleanText.substring(4)}`
        : '+593 ';
      setCelular(formatted);
    }
  };

  const handleCedulaChange = (text: string) => {
    // Solo permitir números
    const cleanText = text.replace(/[^\d]/g, '');
    
    // Limitar a 10 dígitos
    if (cleanText.length <= 10) {
      setCedula(cleanText);
    }
  };

  const validateCelular = () => {
    const phoneNumber = celular.replace(/[^\d]/g, '');
    if (phoneNumber.length !== 13) { // +593 + 10 dígitos
      Alert.alert(
        'Error de validación',
        'El número de celular debe tener exactamente 10 dígitos después del código de país (+593)',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    return true;
  };

  const validateCedula = () => {
    if (cedula.length !== 10) {
      Alert.alert(
        'Error de validación',
        'El número de cédula debe tener exactamente 10 dígitos',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cuenta de Ahorro Básica</Text>

        <Input label="Nombres y Apellidos" placeholder="Ingrese su nombre completo" value={nombre} onChangeText={setNombre} />
        <Input 
          label="Número de Cédula" 
          placeholder="Ingrese su número de cédula" 
          value={cedula} 
          onChangeText={handleCedulaChange}
          keyboardType="numeric"
        />
        <AddressPicker 
          label="Dirección" 
          placeholder="Seleccionar ubicación en el mapa"
          value={direccion}
          onAddressSelect={(addressData) => {
            setDireccionData(addressData);
            setDireccion(addressData.formattedAddress);
          }}
          required
        />

        <Input 
          label="Número de Celular" 
          placeholder="+593 9XXXXXXXXX" 
          value={celular} 
          onChangeText={handleCelularChange}
        />
        <DatePicker 
          label="Fecha de Nacimiento" 
          placeholder="Seleccione su fecha de nacimiento"
          value={fecha}
          onDateSelect={setFecha}
          required
        />

        <Text style={styles.section}>Referencias Personales</Text>
        <Input label="Nombre" placeholder="Nombre de la referencia" value={refNombre} onChangeText={setRefNombre} />
        <Input 
          label="Número de Celular" 
          placeholder="+593 9XXXXXXXXX" 
          value={celular} 
          onChangeText={handleCelularChange}
        />
        <Input label="Relación" placeholder="Relación con la referencia" value={refRel} onChangeText={setRefRel} />

        <View style={{ height: theme.spacing.lg }} />
        <Button 
          title="Guardar" 
          onPress={() => {
            if (validateCedula() && validateCelular()) {
              navigation.goBack();
            }
          }} 
          fullWidth 
        />
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  content: { padding: theme.spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.md },
  section: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
});


