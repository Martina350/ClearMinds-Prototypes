import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ClienteSearch } from '../components/ClienteSearch';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { mockDB, Cuenta, Transaccion, Recibo, TipoCuenta, EstadoCuenta, TipoTransaccion, EstadoTransaccion } from '../../infrastructure/persistence/MockDatabase';

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

const Periodo = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const PagoOption = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[styles.pagoOption, selected && styles.pagoOptionSelected]}>
    <View style={styles.pagoOptionContent}>
      <MaterialIcons
        name={selected ? "radio-button-checked" : "radio-button-unchecked"}
        size={24}
        color={selected ? '#fff' : theme.colors.border}
      />
      <Text style={[styles.pagoOptionText, selected && styles.pagoOptionTextSelected]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export const AhorroFuturoScreen: React.FC<Props> = ({ navigation }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [periodo, setPeriodo] = useState<'30' | '60' | '90' | null>(null);
  const [tipoPago, setTipoPago] = useState<'mensualizado' | 'vencimiento' | null>(null);

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
  };

  const validateForm = () => {
    if (!clienteSeleccionado) {
      Alert.alert('Error', 'Debe seleccionar un cliente');
      return false;
    }
    if (!periodo) {
      Alert.alert('Error', 'Debe seleccionar un período de ahorro');
      return false;
    }
    if (!tipoPago) {
      Alert.alert('Error', 'Debe seleccionar el tipo de pago de intereses');
      return false;
    }
    return true;
  };

  const handleGuardar = () => {
    if (validateForm() && clienteSeleccionado && periodo && tipoPago) {
      // Obtener la cuenta básica del cliente (cuenta madre)
      const cuentasMadre = mockDB.getCuentasByCliente(clienteSeleccionado.id);
      const cuentaBasica = cuentasMadre.find(c => c.tipo === TipoCuenta.BASICA);
      
      if (!cuentaBasica) {
        Alert.alert('Error', 'El cliente debe tener una cuenta básica primero');
        return;
      }
      
      // Calcular tasa de interés según período
      const tasasInteres: Record<string, number> = {
        '30': 0.49,
        '60': 0.99,
        '90': 1.48,
      };
      
      const tasaInteres = tasasInteres[periodo];
      
      // Calcular fecha de vencimiento
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + parseInt(periodo));
      
      Alert.alert(
        'Cuenta de Ahorro Futuro',
        `Se creará cuenta de ahorro futuro para ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellidos}\n\nPeríodo: ${periodo} días\nInterés: ${tasaInteres}%\nPago: ${tipoPago === 'mensualizado' ? 'Mensualizado' : 'Al vencimiento'}\nVence: ${fechaVencimiento.toLocaleDateString('es-EC')}`,
        [
          { text: 'Cancelar' },
          {
            text: 'Confirmar',
            onPress: () => {
              const ahora = new Date();
              const fechaActual = ahora.toISOString().split('T')[0];
              const horaActual = ahora.toLocaleTimeString('es-EC', { hour12: false });
              
              // Generar IDs
              const cuentaId = `CTA${String(mockDB.getCuentas().length + 1).padStart(3, '0')}`;
              const numeroCuenta = mockDB.generarNumeroCuenta(TipoCuenta.AHORRO_FUTURO);
              
              // Crear cuenta de ahorro futuro
              const nuevaCuenta: Cuenta = {
                id: cuentaId,
                numeroCuenta: numeroCuenta,
                clienteId: clienteSeleccionado.id,
                tipo: TipoCuenta.AHORRO_FUTURO,
                saldo: 0, // Inicia en 0, se transfiere después
                saldoDisponible: 0, // Bloqueado hasta vencimiento
                estado: EstadoCuenta.ACTIVA,
                fechaApertura: fechaActual,
                montoInicial: 0,
                plazo: parseInt(periodo),
                fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
                tasaInteres: tasaInteres,
                tipoPago: tipoPago === 'mensualizado' ? 'MENSUALIZADO' : 'AL_VENCIMIENTO',
                cuentaMadreId: cuentaBasica.id,
              };
              
              mockDB.cuentas.push(nuevaCuenta);
              
              // Mostrar éxito
              Alert.alert(
                '¡Éxito!',
                `Cuenta de ahorro futuro creada exitosamente\n\nCliente: ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellidos}\nCuenta: ${numeroCuenta}\nPeríodo: ${periodo} días\nInterés: ${tasaInteres}%\nVencimiento: ${fechaVencimiento.toLocaleDateString('es-EC')}`,
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
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      {/* Búsqueda de Cliente */}
      <Text style={styles.header}>Datos del Cliente</Text>
      <ClienteSearch
        onClienteSelect={handleClienteSelect}
        placeholder="Buscar por cédula, nombre, apellido o número de cuenta"
      />

      {/* Información del Cliente Seleccionado */}
      {clienteSeleccionado && (
        <Card style={styles.clienteCard}>
          <Text style={styles.clienteTitle}>Cliente Seleccionado</Text>
          <Text style={styles.clienteInfo}>Nombre: {clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}</Text>
          <Text style={styles.clienteInfo}>Cédula: {clienteSeleccionado.cedula}</Text>
          <Text style={styles.clienteInfo}>Celular: {clienteSeleccionado.celular}</Text>
          {clienteSeleccionado.numeroCuenta && (
            <Text style={styles.clienteInfo}>Cuenta: {clienteSeleccionado.numeroCuenta}</Text>
          )}
        </Card>
      )}

      {/* Período de Ahorro */}
      <Text style={styles.header}>Período de Ahorro</Text>
        <View style={styles.periodosContainer}>
          <View style={styles.periodoItem}>
            <Periodo label="Intereses: 0.49% en 30 días" selected={periodo === '30'} onPress={() => setPeriodo('30')} />
          </View>
          <View style={styles.periodoItem}>
            <Periodo label="Intereses: 0.99% en 60 días" selected={periodo === '60'} onPress={() => setPeriodo('60')} />
          </View>
          <View style={styles.periodoItem}>
            <Periodo label="Intereses: 1.48% en 90 días" selected={periodo === '90'} onPress={() => setPeriodo('90')} />
          </View>
        </View>

      {/* Tipo de Pago de Intereses */}
      <Text style={styles.header}>Tipo de Pago</Text>
      <View style={styles.pagoOptionsContainer}>
        <PagoOption
          label="Mensualizado"
          selected={tipoPago === 'mensualizado'}
          onPress={() => setTipoPago('mensualizado')}
        />
        <PagoOption
          label="Vencimiento de Intereses"
          selected={tipoPago === 'vencimiento'}
          onPress={() => setTipoPago('vencimiento')}
        />
      </View>

      <View style={{ height: theme.spacing.lg }} />
      <Button title="Crear Cuenta de Ahorro Futuro" onPress={handleGuardar} fullWidth />
      <View style={{ height: theme.spacing.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  header: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  periodosContainer: {
    marginBottom: theme.spacing.md,
  },
  periodoItem: {
    marginBottom: theme.spacing.sm,
  },
  porcentajeText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: theme.colors.background
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  chipText: {
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  clienteCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  clienteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  clienteInfo: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  pagoOptionsContainer: {
    marginBottom: theme.spacing.md,
  },
  pagoOption: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  pagoOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  pagoOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagoOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  pagoOptionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});


