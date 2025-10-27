import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Input, AddressPicker, DatePicker } from '../components';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { mockDB, Cliente, Cuenta, Transaccion, Recibo, TipoCuenta, EstadoCuenta, TipoTransaccion, EstadoTransaccion, ReferenciaPersonal as RefPersonalDB } from '../../infrastructure/persistence/MockDatabase';

interface Props { navigation: any; }

interface ReferenciaPersonal {
  id: string;
  nombre: string;
  telefono: string;
  relacion: string;
}

export const AperturaBasicaScreen: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [direccionData, setDireccionData] = useState<any>(null);
  const [direccionManual, setDireccionManual] = useState(false);
  const [celular, setCelular] = useState('+593 ');
  const [fecha, setFecha] = useState('');
  const [montoInicial, setMontoInicial] = useState('');
  const [referencias, setReferencias] = useState<ReferenciaPersonal[]>([]);
  const [refNombre, setRefNombre] = useState('');
  const [refTel, setRefTel] = useState('+593 ');
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

  const handleRefTelChange = (text: string) => {
    // Asegurar que siempre empiece con +593
    if (!text.startsWith('+593')) {
      setRefTel('+593 ');
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
      setRefTel(formatted);
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

  const validateNombreApellido = () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert('Error de validación', 'Nombres y Apellidos son requeridos', [{ text: 'Aceptar' }]);
      return false;
    }
    if (nombre.length > 100 || apellido.length > 100) {
      Alert.alert('Error de validación', 'Nombres y Apellidos no deben superar 100 caracteres', [{ text: 'Aceptar' }]);
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

  const validateRefTel = () => {
    const phoneNumber = refTel.replace(/[^\d]/g, '');
    if (phoneNumber.length !== 13) { // +593 + 10 dígitos
      Alert.alert(
        'Error de validación',
        'El número de teléfono de la referencia debe tener exactamente 10 dígitos después del código de país (+593)',
        [{ text: 'Aceptar' }]
      );
      return false;
    }
    return true;
  };

  const agregarReferencia = () => {
    if (!refNombre.trim()) {
      Alert.alert('Error', 'El nombre de la referencia es requerido');
      return;
    }
    
    if (!validateRefTel()) {
      return;
    }
    
    if (!refRel.trim()) {
      Alert.alert('Error', 'La relación con la referencia es requerida');
      return;
    }

    if (referencias.length >= 2) {
      Alert.alert('Error', 'Solo se pueden agregar máximo 2 referencias personales');
      return;
    }

    const nuevaReferencia: ReferenciaPersonal = {
      id: Date.now().toString(),
      nombre: refNombre.trim(),
      telefono: refTel,
      relacion: refRel.trim(),
    };

    setReferencias([...referencias, nuevaReferencia]);
    setRefNombre('');
    setRefTel('+593 ');
    setRefRel('');
  };

  const eliminarReferencia = (id: string) => {
    setReferencias(referencias.filter(ref => ref.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cuenta de Ahorro Básica</Text>

        <Input label="Nombres" placeholder="Ingrese sus nombres" value={nombre} onChangeText={(t)=> t.length<=100 && setNombre(t)} />
        <Input label="Apellidos" placeholder="Ingrese sus apellidos" value={apellido} onChangeText={(t)=> t.length<=100 && setApellido(t)} />
        <Input 
          label="Número de Cédula" 
          placeholder="Ingrese su número de cédula" 
          value={cedula} 
          onChangeText={handleCedulaChange}
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
              value={direccion}
              onAddressSelect={(addressData) => {
                setDireccionData(addressData);
                setDireccion(addressData.formattedAddress);
              }}
              required
            />
          ) : (
            <Input 
              label=""
              placeholder="Ingrese su dirección completa"
              value={direccion}
              onChangeText={setDireccion}
              multiline
              numberOfLines={3}
            />
          )}
        </View>

        <Input 
          label="Número de Celular" 
          placeholder="+593 9XXXXXXXXX" 
          value={celular} 
          onChangeText={handleCelularChange}
          keyboardType="numeric"
        />
        <DatePicker 
          label="Fecha de Nacimiento" 
          placeholder="Seleccione su fecha de nacimiento"
          value={fecha}
          onDateSelect={setFecha}
          required
        />

        <Input 
          label="Monto Inicial ($)" 
          placeholder="10.00" 
          value={montoInicial}
          onChangeText={setMontoInicial}
          keyboardType="numeric"
        />

        <Text style={styles.section}>Referencias Personales</Text>
        
        {/* Lista de referencias agregadas */}
        {referencias.map((referencia, index) => (
          <Card key={referencia.id} style={styles.referenciaCard}>
            <View style={styles.referenciaHeader}>
              <Text style={styles.referenciaTitle}>Referencia {index + 1}</Text>
              <TouchableOpacity 
                onPress={() => eliminarReferencia(referencia.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.referenciaInfo}>Nombre: {referencia.nombre}</Text>
            <Text style={styles.referenciaInfo}>Teléfono: {referencia.telefono}</Text>
            <Text style={styles.referenciaInfo}>Relación: {referencia.relacion}</Text>
          </Card>
        ))}

        {/* Formulario para agregar nueva referencia */}
        {referencias.length < 2 && (
          <View style={styles.nuevaReferenciaContainer}>
            <Text style={styles.nuevaReferenciaTitle}>
              {referencias.length === 0 ? 'Agregar Referencia Personal' : 'Agregar Segunda Referencia'}
            </Text>
            <Input label="Nombres y Apellidos" placeholder="Nombre de la referencia" value={refNombre} onChangeText={setRefNombre} />
            <Input 
              label="Número de Celular" 
              placeholder="+593 9XXXXXXXXX" 
              value={refTel} 
              onChangeText={handleRefTelChange}
              keyboardType="numeric"
            />
            <Input label="Relación" placeholder="Relación con la referencia" value={refRel} onChangeText={setRefRel} />
            <Button 
              title="Agregar Referencia" 
              onPress={agregarReferencia}
              fullWidth 
              variant="primary"
            />
          </View>
        )}

        <View style={{ height: theme.spacing.lg }} />
        <Button 
          title="Guardar" 
          onPress={() => {
            if (validateCedula() && validateCelular() && validateNombreApellido() && validateMontoInicial()) {
              const monto = parseFloat((montoInicial || '').replace(/,/g, '.'));
              const costoApertura = 1;
              const total = (monto + costoApertura).toFixed(2);
              
              Alert.alert(
                'Apertura de Cuenta',
                `Titular: ${nombre} ${apellido}\nMonto inicial: $${monto.toFixed(2)}\nCosto de apertura: $${costoApertura.toFixed(2)}\nTotal a cobrar: $${total}`,
                [
                  { text: 'Cancelar' },
                  { 
                    text: 'Confirmar', 
                    onPress: () => {
                      // Generar IDs
                      const clienteId = `CLI${String(mockDB.getClientes().length + 1).padStart(3, '0')}`;
                      const cuentaId = `CTA${String(mockDB.getCuentas().length + 1).padStart(3, '0')}`;
                      const transaccionId = `TRX${String(mockDB.getTransacciones().length + 1).padStart(3, '0')}`;
                      const reciboId = `REC${String(mockDB.getRecibos().length + 1).padStart(3, '0')}`;
                      
                      const ahora = new Date();
                      const fechaActual = ahora.toISOString().split('T')[0];
                      const horaActual = ahora.toLocaleTimeString('es-EC', { hour12: false });
                      
                      // Crear cliente
                      const nuevoCliente: Cliente = {
                        id: clienteId,
                        cedula: cedula,
                        nombre: nombre,
                        apellidos: apellido,
                        fechaNacimiento: fecha,
                        celular: celular,
                        direccion: direccion,
                        coordenadas: direccionData ? {
                          latitud: direccionData.latitude || 0,
                          longitud: direccionData.longitude || 0,
                        } : undefined,
                        fechaRegistro: `${fechaActual} ${horaActual}`,
                        agente: 'AG001', // Agente por defecto
                      };
                      
                      mockDB.agregarCliente(nuevoCliente);
                      
                      // Agregar referencias personales
                      referencias.forEach(ref => {
                        const referenciaDB: RefPersonalDB = {
                          id: `REF${String(mockDB.getClientes().length + referencias.indexOf(ref) + 1).padStart(3, '0')}`,
                          clienteId: clienteId,
                          nombre: ref.nombre,
                          telefono: ref.telefono,
                          parentesco: ref.relacion,
                        };
                        mockDB.referencias.push(referenciaDB);
                      });
                      
                      // Generar número de cuenta
                      const numeroCuenta = mockDB.generarNumeroCuenta(TipoCuenta.BASICA);
                      
                      // Crear cuenta
                      const nuevaCuenta: Cuenta = {
                        id: cuentaId,
                        numeroCuenta: numeroCuenta,
                        clienteId: clienteId,
                        tipo: TipoCuenta.BASICA,
                        saldo: monto,
                        saldoDisponible: monto,
                        estado: EstadoCuenta.ACTIVA,
                        fechaApertura: fechaActual,
                        montoInicial: monto,
                      };
                      
                      mockDB.cuentas.push(nuevaCuenta);
                      
                      // Generar número de transacción
                      const numeroTransaccion = mockDB.generarNumeroTransaccion();
                      
                      // Crear transacción
                      const nuevaTransaccion: Transaccion = {
                        id: transaccionId,
                        numero: numeroTransaccion,
                        cuentaId: cuentaId,
                        clienteId: clienteId,
                        tipo: TipoTransaccion.APERTURA,
                        monto: monto,
                        saldoAnterior: 0,
                        saldoNuevo: monto,
                        estado: EstadoTransaccion.COMPLETADA,
                        fecha: fechaActual,
                        hora: horaActual,
                        concepto: 'Apertura de cuenta de ahorro básica',
                        agenteId: 'AG001',
                        recibo: numeroTransaccion,
                      };
                      
                      mockDB.agregarTransaccion(nuevaTransaccion);
                      
                      // Crear recibo
                      const nuevoRecibo: Recibo = {
                        id: reciboId,
                        numero: numeroTransaccion,
                        transaccionId: transaccionId,
                        clienteId: clienteId,
                        tipo: 'Apertura de Cuenta',
                        monto: monto,
                        fecha: fechaActual,
                        hora: horaActual,
                        estado: 'IMPRESO',
                        agenteId: 'AG001',
                      };
                      
                      mockDB.agregarRecibo(nuevoRecibo);
                      
                      // Mostrar éxito
                      Alert.alert(
                        '¡Éxito!',
                        `Cuenta creada exitosamente\n\nCliente: ${nombre} ${apellido}\nCuenta: ${numeroCuenta}\nSaldo: $${monto.toFixed(2)}`,
                        [
                          {
                            text: 'Aceptar',
                            onPress: () => navigation.goBack()
                          }
                        ]
                      );
                    }
                  }
                ]
              );
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
  referenciaCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  referenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  referenciaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  referenciaInfo: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  nuevaReferenciaContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    ...theme.shadows.card,
  },
  nuevaReferenciaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
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


