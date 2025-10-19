import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Input, AddressPicker, DatePicker } from '../components';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

interface Props { navigation: any; }

export const AperturaInfantilScreen: React.FC<Props> = ({ navigation }) => {
  const [solNombre, setSolNombre] = useState('');
  const [solCedula, setSolCedula] = useState('');
  const [solDireccion, setSolDireccion] = useState('');
  const [solDireccionData, setSolDireccionData] = useState<any>(null);
  const [solCelular, setSolCelular] = useState('+593 ');
  const [menorNombre, setMenorNombre] = useState('');
  const [menorCedula, setMenorCedula] = useState('');
  const [menorNacimiento, setMenorNacimiento] = useState('');
  const [adultoNombre, setAdultoNombre] = useState('');
  const [adultoCedula, setAdultoCedula] = useState('');
  const [relacion, setRelacion] = useState('');

  const handleCelularChange = (text: string) => {
    // Asegurar que siempre empiece con +593
    if (!text.startsWith('+593')) {
      setSolCelular('+593 ');
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
      setSolCelular(formatted);
    }
  };

  const handleCedulaChange = (text: string) => {
    // Solo permitir números
    const cleanText = text.replace(/[^\d]/g, '');
    
    // Limitar a 10 dígitos
    if (cleanText.length <= 10) {
      setSolCedula(cleanText);
    }
  };

  const validateCelular = () => {
    const phoneNumber = solCelular.replace(/[^\d]/g, '');
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
    if (solCedula.length !== 10) {
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={styles.header}>Datos del Menor</Text>
      <Input label="Nombre del Menor" placeholder="Ingresa el nombre del menor" value={menorNombre} onChangeText={setMenorNombre} />
      <Input 
        label="Número de Cédula" 
        placeholder="Ingresa la cédula/ID del menor" 
        value={solCedula} 
        onChangeText={handleCedulaChange}
        keyboardType="numeric"
      />
      <AddressPicker 
        label="Dirección" 
        placeholder="Seleccionar ubicación en el mapa"
        value={solDireccion}
        onAddressSelect={(addressData) => {
          setSolDireccionData(addressData);
          setSolDireccion(addressData.formattedAddress);
        }}
        required
      />
      <DatePicker 
        label="Fecha de Nacimiento del Menor" 
        placeholder="Selecciona la fecha de nacimiento del menor"
        value={menorNacimiento}
        onDateSelect={setMenorNacimiento}
        required
      />

      <Text style={styles.header}>Datos del Adulto Responsable</Text>
      <Input label="Nombre del Adulto Responsable" placeholder="Ingresa el nombre del adulto responsable" value={adultoNombre} onChangeText={setAdultoNombre} />
      <Input 
        label="Cédula/ID del Adulto Responsable" 
        placeholder="Ingresa la cédula/ID del adulto responsable" 
        value={solCedula} 
        onChangeText={handleCedulaChange}
        keyboardType="numeric"
      />
      <Input 
        label="Número de Celular" 
        placeholder="+593 9XXXXXXXXX" 
        value={solCelular} 
        onChangeText={handleCelularChange}
      />
      <Input label="Relación" placeholder="Ingresa la relación con el menor" value={relacion} onChangeText={setRelacion} />

      <Button 
        title="Guardar" 
        onPress={() => {
          if (validateCelular()) {
            navigation.goBack();
          }
        }} 
        fullWidth 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
});


