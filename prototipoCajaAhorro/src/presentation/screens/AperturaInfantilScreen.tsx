import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { Input, AddressPicker, DatePicker } from '../components';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ClienteSearch } from '../components/ClienteSearch';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Props { navigation: any; }

interface Cliente {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  celular: string;
  numeroCuenta?: string;
  saldo?: number;
}

export const AperturaInfantilScreen: React.FC<Props> = ({ navigation }) => {
  const [solNombre, setSolNombre] = useState('');
  const [solApellido, setSolApellido] = useState('');
  const [solCedula, setSolCedula] = useState('');
  const [solDireccion, setSolDireccion] = useState('');
  const [solDireccionData, setSolDireccionData] = useState<any>(null);
  const [direccionManual, setDireccionManual] = useState(false);
  const [solCelular, setSolCelular] = useState('+593 ');
  const [montoInicial, setMontoInicial] = useState('');
  const [menorNombre, setMenorNombre] = useState('');
  const [menorApellido, setMenorApellido] = useState('');
  const [menorCedula, setMenorCedula] = useState('');
  const [menorNacimiento, setMenorNacimiento] = useState('');
  const [adultoNombre, setAdultoNombre] = useState('');
  const [adultoApellido, setAdultoApellido] = useState('');
  const [adultoCedula, setAdultoCedula] = useState('');
  const [relacion, setRelacion] = useState('');
  const [showRelacionDropdown, setShowRelacionDropdown] = useState(false);
  const [isCustomRelacion, setIsCustomRelacion] = useState(false);
  
  // Estados para búsqueda de cliente existente
  const [modoAdulto, setModoAdulto] = useState<'existente' | 'nuevo'>('existente');
  const [adultoSeleccionado, setAdultoSeleccionado] = useState<Cliente | null>(null);

  const opcionesRelacion = [
    { id: 'madre', label: 'Madre' },
    { id: 'padre', label: 'Padre' },
    { id: 'otro', label: 'Otro' },
  ];

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

  const handleCedulaMenorChange = (text: string) => {
    // Solo permitir números
    const cleanText = text.replace(/[^\d]/g, '');
    
    // Limitar a 10 dígitos
    if (cleanText.length <= 10) {
      setMenorCedula(cleanText);
    }
  };

  const handleCedulaAdultoChange = (text: string) => {
    // Solo permitir números
    const cleanText = text.replace(/[^\d]/g, '');
    
    // Limitar a 10 dígitos
    if (cleanText.length <= 10) {
      setAdultoCedula(cleanText);
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

  const validateNombresApellidos = () => {
    if (!menorNombre.trim() || !menorApellido.trim() || !adultoNombre.trim() || !adultoApellido.trim()) {
      Alert.alert('Error de validación', 'Todos los nombres y apellidos son requeridos', [{ text: 'Aceptar' }]);
      return false;
    }
    if (menorNombre.length > 100 || menorApellido.length > 100 || adultoNombre.length > 100 || adultoApellido.length > 100) {
      Alert.alert('Error de validación', 'Cada campo de nombres y apellidos no debe superar 100 caracteres', [{ text: 'Aceptar' }]);
      return false;
    }
    return true;
  };

  const validateCedulas = () => {
    // Validar cédula del menor
    if (menorCedula.length !== 10) {
      Alert.alert(
        'Error de validación',
        'El número de cédula del menor debe tener exactamente 10 dígitos',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    
    // Validar cédula del adulto (solo si es nuevo cliente)
    if (modoAdulto === 'nuevo' && adultoCedula.length !== 10) {
      Alert.alert(
        'Error de validación',
        'El número de cédula del adulto debe tener exactamente 10 dígitos',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    
    return true;
  };

  const validateMontoInicial = () => {
    const parsed = parseFloat((montoInicial || '').replace(/,/g, '.'));
    if (isNaN(parsed) || parsed < 10) {
      Alert.alert(
        'Monto inicial inválido',
        'El monto inicial debe ser al menos $10.00',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    return true;
  };

  const handleRelacionSelect = (opcion: { id: string; label: string }) => {
    if (opcion.id === 'otro') {
      setIsCustomRelacion(true);
      setRelacion(''); // Limpiar el campo para que aparezca vacío
    } else {
      setRelacion(opcion.label);
      setIsCustomRelacion(false);
    }
    setShowRelacionDropdown(false);
  };

  const toggleRelacionDropdown = () => {
    setShowRelacionDropdown(!showRelacionDropdown);
  };

  const handleRelacionChange = (text: string) => {
    setRelacion(text);
    // Mantener el modo personalizado mientras se escribe
    if (!isCustomRelacion) {
      setIsCustomRelacion(true);
    }
  };

  // Función para manejar la selección de cliente existente
  const handleClienteExistenteSelect = (cliente: Cliente) => {
    setAdultoSeleccionado(cliente);
    // Auto-llenar campos del adulto responsable
    setAdultoNombre(cliente.nombre);
    setAdultoApellido(cliente.apellidos);
    setAdultoCedula(cliente.cedula);
    setSolCelular(cliente.celular || '+593 ');
  };

  // Función para cambiar entre modo existente y nuevo
  const handleModoAdultoChange = (modo: 'existente' | 'nuevo') => {
    setModoAdulto(modo);
    if (modo === 'nuevo') {
      // Limpiar la selección cuando cambia a nuevo
      setAdultoSeleccionado(null);
      setAdultoNombre('');
      setAdultoApellido('');
      setAdultoCedula('');
      setSolCelular('+593 ');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={styles.header}>Datos del Menor</Text>
      <Input label="Nombres del Menor" placeholder="Ingresa los nombres del menor" value={menorNombre} onChangeText={(t)=> t.length<=100 && setMenorNombre(t)} />
      <Input label="Apellidos del Menor" placeholder="Ingresa los apellidos del menor" value={menorApellido} onChangeText={(t)=> t.length<=100 && setMenorApellido(t)} />
      <Input 
        label="Número de Cédula" 
        placeholder="Ingresa la cédula/ID del menor" 
        value={menorCedula} 
        onChangeText={handleCedulaMenorChange}
        keyboardType="numeric"
      />
      <View style={styles.direccionContainer}>
        <Text style={styles.direccionLabel}>Dirección</Text>
        <View style={styles.direccionOptions}>
          <TouchableOpacity 
            style={[styles.direccionOption, !direccionManual && styles.direccionOptionSelected]}
            onPress={() => setDireccionManual(false)}
          >
            <MaterialIcons name="map" size={20} color={!direccionManual ? '#fff' : theme.colors.primary} />
            <Text style={[styles.direccionOptionText, !direccionManual && styles.direccionOptionTextSelected]}>
              Mapa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.direccionOption, direccionManual && styles.direccionOptionSelected]}
            onPress={() => setDireccionManual(true)}
          >
            <MaterialIcons name="edit" size={20} color={direccionManual ? '#fff' : theme.colors.primary} />
            <Text style={[styles.direccionOptionText, direccionManual && styles.direccionOptionTextSelected]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>
        
        {!direccionManual ? (
          <AddressPicker 
            label=""
            placeholder="Seleccionar ubicación en el mapa"
            value={solDireccion}
            onAddressSelect={(addressData) => {
              setSolDireccionData(addressData);
              setSolDireccion(addressData.formattedAddress);
            }}
            required
          />
        ) : (
          <Input 
            label=""
            placeholder="Ingrese la dirección completa"
            value={solDireccion}
            onChangeText={setSolDireccion}
            multiline
            numberOfLines={3}
          />
        )}
      </View>
      <DatePicker 
        label="Fecha de Nacimiento del Menor" 
        placeholder="Selecciona la fecha de nacimiento del menor"
        value={menorNacimiento}
        onDateSelect={setMenorNacimiento}
        required
      />

      <Text style={styles.header}>Datos del Adulto Responsable</Text>
      
      {/* Toggle para elegir entre cliente existente o nuevo */}
      <View style={styles.modoSelector}>
        <TouchableOpacity 
          style={[styles.modoOption, modoAdulto === 'existente' && styles.modoOptionSelected]}
          onPress={() => handleModoAdultoChange('existente')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="search" 
            size={20} 
            color={modoAdulto === 'existente' ? '#fff' : theme.colors.primary} 
          />
          <Text style={[styles.modoText, modoAdulto === 'existente' && styles.modoTextSelected]}>
            Cliente Existente
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modoOption, modoAdulto === 'nuevo' && styles.modoOptionSelected]}
          onPress={() => handleModoAdultoChange('nuevo')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="person-add" 
            size={20} 
            color={modoAdulto === 'nuevo' ? '#fff' : theme.colors.primary} 
          />
          <Text style={[styles.modoText, modoAdulto === 'nuevo' && styles.modoTextSelected]}>
            Nuevo Cliente
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar búsqueda o formulario según modo */}
      {modoAdulto === 'existente' ? (
        <>
          <ClienteSearch 
            onClienteSelect={handleClienteExistenteSelect}
            placeholder="Buscar por cédula, nombre o número de cuenta"
          />
          
          {/* Mostrar información del cliente seleccionado */}
          {adultoSeleccionado && (
            <Card style={styles.clienteCard}>
              <View style={styles.clienteHeader}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.clienteTitle}>Cliente Seleccionado</Text>
              </View>
              <View style={styles.clienteInfoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nombre:</Text>
                  <Text style={styles.infoValue}>
                    {adultoSeleccionado.nombre} {adultoSeleccionado.apellidos}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cédula:</Text>
                  <Text style={styles.infoValue}>{adultoSeleccionado.cedula}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Celular:</Text>
                  <Text style={styles.infoValue}>{adultoSeleccionado.celular}</Text>
                </View>
                {adultoSeleccionado.numeroCuenta && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cuenta:</Text>
                    <Text style={styles.infoValue}>{adultoSeleccionado.numeroCuenta}</Text>
                  </View>
                )}
              </View>
            </Card>
          )}
        </>
      ) : (
        // Formulario para nuevo cliente
        <>
          <Input 
            label="Nombres del Adulto Responsable" 
            placeholder="Ingresa los nombres del adulto responsable" 
            value={adultoNombre} 
            onChangeText={(t)=> t.length<=100 && setAdultoNombre(t)} 
          />
          <Input 
            label="Apellidos del Adulto Responsable" 
            placeholder="Ingresa los apellidos del adulto responsable" 
            value={adultoApellido} 
            onChangeText={(t)=> t.length<=100 && setAdultoApellido(t)} 
          />
          <Input 
            label="Cédula/ID del Adulto Responsable" 
            placeholder="Ingresa la cédula/ID del adulto responsable" 
            value={adultoCedula} 
            onChangeText={handleCedulaAdultoChange}
            keyboardType="numeric"
          />
          <Input 
            label="Número de Celular" 
            placeholder="+593 9XXXXXXXXX" 
            value={solCelular} 
            onChangeText={handleCelularChange}
            keyboardType="numeric"
          />
        </>
      )}
      <Input 
        label="Monto Inicial ($)" 
        placeholder="10.00" 
        value={montoInicial}
        onChangeText={setMontoInicial}
        keyboardType="numeric"
      />
      <View style={styles.relacionContainer}>
        <Text style={styles.relacionLabel}>Relación con el menor</Text>
        {!isCustomRelacion ? (
          <TouchableOpacity 
            style={styles.relacionSelector}
            onPress={toggleRelacionDropdown}
            activeOpacity={0.7}
          >
            <Text style={[styles.relacionText, !relacion && styles.relacionPlaceholder]}>
              {relacion || 'Selecciona la relación'}
            </Text>
            <MaterialIcons 
              name={showRelacionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        ) : (
          <TextInput
            placeholder="Ingresa la relación con el menor"
            value={relacion}
            onChangeText={handleRelacionChange}
            style={styles.customRelacionInput}
            placeholderTextColor={theme.colors.subtitle}
          />
        )}

        {/* Dropdown de opciones */}
        {showRelacionDropdown && !isCustomRelacion && (
          <View style={styles.dropdownContainer}>
            {opcionesRelacion.map((opcion) => (
              <TouchableOpacity
                key={opcion.id}
                style={styles.dropdownItem}
                onPress={() => handleRelacionSelect(opcion)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{opcion.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.border} />
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>

      <Button 
        title="Guardar" 
        onPress={() => {
          // Validar que hay un cliente adulto seleccionado o ingresado
          if (modoAdulto === 'existente' && !adultoSeleccionado) {
            Alert.alert(
              'Error de validación',
              'Debe seleccionar un cliente existente o cambiar a "Nuevo Cliente"',
              [{ text: 'Aceptar' }]
            );
            return;
          }
          
          if (validateCedulas() && validateCelular() && validateMontoInicial() && validateNombresApellidos()) {
            const monto = parseFloat((montoInicial || '').replace(/,/g, '.'));
            const costoApertura = 1;
            const total = (monto + costoApertura).toFixed(2);
            
            const nombreCompleto = `${adultoNombre} ${adultoApellido}`.trim();
            const tipoAdulto = modoAdulto === 'existente' ? '(Cliente existente)' : '(Nuevo cliente)';
            
            Alert.alert(
              'Apertura de Cuenta Infantil',
              `Titular (menor): ${menorNombre} ${menorApellido}\nCédula menor: ${menorCedula}\n\nRepresentante: ${nombreCompleto} ${tipoAdulto}\nCédula adulto: ${adultoCedula}\nCelular: ${solCelular}\n\nMonto inicial: $${monto.toFixed(2)}\nCosto de apertura: $${costoApertura.toFixed(2)}\nTotal a cobrar: $${total}`,
              [
                { text: 'Cancelar' },
                { text: 'Confirmar', onPress: () => navigation.goBack() }
              ]
            );
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
  // Estilos para selector de modo (Existente/Nuevo)
  modoSelector: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  modoOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  modoOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modoText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 6,
  },
  modoTextSelected: {
    color: '#fff',
  },
  // Estilos para card de cliente seleccionado
  clienteCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  clienteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 8,
  },
  clienteInfoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    flex: 2,
    textAlign: 'right',
  },
  relacionContainer: {
    marginBottom: theme.spacing.md,
  },
  relacionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  relacionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    minHeight: 52,
  },
  relacionText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  relacionPlaceholder: {
    color: theme.colors.subtitle,
  },
  // Estilos del dropdown
  dropdownContainer: {
    marginTop: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  customRelacionInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    minHeight: 52,
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 0,
    marginBottom: 0,
  },
  direccionContainer: {
    marginBottom: theme.spacing.md,
  },
  direccionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  direccionOptions: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  direccionOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  direccionOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  direccionOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 6,
  },
  direccionOptionTextSelected: {
    color: '#fff',
  },
});


