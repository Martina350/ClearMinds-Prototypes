import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { ClienteSearch } from '../components/ClienteSearch';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { mockDB, Transaccion, Recibo, TipoTransaccion, EstadoTransaccion, TipoCuenta } from '../../infrastructure/persistence/MockDatabase';

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

export const DepositosScreen: React.FC<Props> = ({ navigation }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [monto, setMonto] = useState('');
  const [notas, setNotas] = useState('');

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleMontoChange = (text: string) => {
    // Solo permitir números y un punto decimal
    const cleanText = text.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limitar a 2 decimales
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setMonto(cleanText);
  };

  const handleRealizarDeposito = () => {
    if (!clienteSeleccionado) {
      Alert.alert('Error', 'Debe seleccionar un cliente primero');
      return;
    }
    
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      Alert.alert('Error', 'Debe ingresar un monto válido mayor a cero');
      return;
    }

    if (montoNumero < 1) {
      Alert.alert('Error', 'El monto mínimo de depósito es $1.00');
      return;
    }

    // Obtener la cuenta del cliente
    const cuentas = mockDB.getCuentasByCliente(clienteSeleccionado.id);
    // Buscar cuenta básica o infantil activa
    const cuentaActiva = cuentas.find(c => 
      (c.tipo === TipoCuenta.BASICA || c.tipo === TipoCuenta.INFANTIL) && 
      c.estado === 'ACTIVA'
    );
    
    if (!cuentaActiva) {
      Alert.alert('Error', 'El cliente no tiene una cuenta activa para realizar depósitos');
      return;
    }

    Alert.alert(
      'Confirmar Depósito',
      `¿Desea realizar un depósito de $${montoNumero.toFixed(2)} a la cuenta de ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellidos}?`,
      [
        { text: 'Cancelar' },
        {
          text: 'Confirmar',
          onPress: () => {
            const ahora = new Date();
            const fechaActual = ahora.toISOString().split('T')[0];
            const horaActual = ahora.toLocaleTimeString('es-EC', { hour12: false });
            
            // Generar IDs
            const transaccionId = `TRX${String(mockDB.getTransacciones().length + 1).padStart(3, '0')}`;
            const reciboId = `REC${String(mockDB.getRecibos().length + 1).padStart(3, '0')}`;
            const numeroTransaccion = mockDB.generarNumeroTransaccion();
            
            // Crear transacción de depósito
            const nuevaTransaccion: Transaccion = {
              id: transaccionId,
              numero: numeroTransaccion,
              cuentaId: cuentaActiva.id,
              clienteId: clienteSeleccionado.id,
              tipo: TipoTransaccion.DEPOSITO,
              monto: montoNumero,
              saldoAnterior: cuentaActiva.saldo,
              saldoNuevo: cuentaActiva.saldo + montoNumero,
              estado: EstadoTransaccion.COMPLETADA,
              fecha: fechaActual,
              hora: horaActual,
              concepto: notas || 'Depósito en efectivo',
              agenteId: 'AG001',
              recibo: numeroTransaccion,
              notas: notas,
            };
            
            mockDB.agregarTransaccion(nuevaTransaccion); // Actualiza el saldo automáticamente
            
            // Crear recibo
            const nuevoRecibo: Recibo = {
              id: reciboId,
              numero: numeroTransaccion,
              transaccionId: transaccionId,
              clienteId: clienteSeleccionado.id,
              tipo: 'Depósito',
              monto: montoNumero,
              fecha: fechaActual,
              hora: horaActual,
              estado: 'IMPRESO',
              agenteId: 'AG001',
            };
            
            mockDB.agregarRecibo(nuevoRecibo);
            
            // Navegar a la pantalla de recibo con los datos
            navigation.navigate('Recibo', {
              cliente: clienteSeleccionado,
              monto: montoNumero,
              notas: notas,
              tipo: 'DEPOSITO',
              numeroRecibo: numeroTransaccion,
              saldoNuevo: nuevaTransaccion.saldoNuevo,
            });
          }
        }
      ]
    );
  };

  const validarMonto = () => {
    const montoNumero = parseFloat(monto);
    return !isNaN(montoNumero) && montoNumero > 0;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }} nestedScrollEnabled={true}>
      <ClienteSearch 
        onClienteSelect={handleClienteSelect}
        placeholder="Buscar cliente por cédula, nombre o número de cuenta"
      />

      {clienteSeleccionado && (
        <Card style={styles.clienteCard}>
          <Text style={styles.clienteNombre}>
            {clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}
          </Text>
          <Text style={styles.clienteCedula}>Cédula: {clienteSeleccionado.cedula}</Text>
          <Text style={styles.clienteCelular}>{clienteSeleccionado.celular}</Text>
          {clienteSeleccionado.numeroCuenta && (
            <Text style={styles.clienteCuenta}>Cuenta: {clienteSeleccionado.numeroCuenta}</Text>
          )}
          {clienteSeleccionado.saldo !== undefined && (
            <Text style={styles.clienteSaldo}>Saldo actual: ${clienteSeleccionado.saldo.toFixed(2)}</Text>
          )}
        </Card>
      )}

      {clienteSeleccionado && (
        <>
          <Input 
            label="Monto del depósito" 
            placeholder="Ingrese el monto a depositar" 
            keyboardType="decimal-pad" 
            value={monto} 
            onChangeText={handleMontoChange}
            required
          />
          
          <Input 
            label="Notas (opcional)" 
            placeholder="Agregar notas sobre el depósito" 
            multiline 
            value={notas} 
            onChangeText={setNotas}
            numberOfLines={3}
          />

          {monto && validarMonto() && (
            <Card style={styles.resumenCard}>
              <Text style={styles.resumenTitle}>Resumen del Depósito</Text>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Cliente:</Text>
                <Text style={styles.resumenValue}>
                  {clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}
                </Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Monto:</Text>
                <Text style={styles.resumenMonto}>${parseFloat(monto).toFixed(2)}</Text>
              </View>
              {notas && (
                <View style={styles.resumenRow}>
                  <Text style={styles.resumenLabel}>Notas:</Text>
                  <Text style={styles.resumenValue}>{notas}</Text>
                </View>
              )}
            </Card>
          )}

          <Button 
            title="Realizar Depósito" 
            onPress={handleRealizarDeposito} 
            fullWidth 
            disabled={!validarMonto()}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  clienteCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  clienteCedula: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginBottom: 2,
  },
  clienteCelular: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginBottom: 2,
  },
  clienteCuenta: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  clienteSaldo: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  resumenCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  resumenLabel: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  resumenValue: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    flex: 2,
    textAlign: 'right',
  },
  resumenMonto: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});


