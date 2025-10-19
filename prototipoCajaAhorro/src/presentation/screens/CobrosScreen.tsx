import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { ClienteSearch } from '../components/ClienteSearch';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

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

interface Cobranza {
  id: string;
  concepto: string;
  montoPendiente: number;
  montoMora: number;
  montoInteres: number;
  fechaVencimiento: string;
  diasMora: number;
  numeroCuota?: number;
  tipo: string;
}

export const CobrosScreen: React.FC<Props> = ({ navigation }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [cobranzas, setCobranzas] = useState<Cobranza[]>([]);
  const [montoSeleccionado, setMontoSeleccionado] = useState<number>(0);
  const [cobranzaSeleccionada, setCobranzaSeleccionada] = useState<string | null>(null);

  // Datos de ejemplo de cobranzas
  const cobranzasEjemplo: Cobranza[] = [
    {
      id: '1',
      concepto: 'Préstamo Personal',
      montoPendiente: 150.00,
      montoMora: 25.50,
      montoInteres: 12.00,
      fechaVencimiento: '2024-01-15',
      diasMora: 5,
      numeroCuota: 3,
      tipo: 'CUOTA_PRESTAMO'
    },
    {
      id: '2',
      concepto: 'Préstamo Personal',
      montoPendiente: 150.00,
      montoMora: 0,
      montoInteres: 12.00,
      fechaVencimiento: '2024-02-15',
      diasMora: 0,
      numeroCuota: 4,
      tipo: 'CUOTA_PRESTAMO'
    }
  ];

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setCobranzas(cobranzasEjemplo);
    setCobranzaSeleccionada(null);
    setMontoSeleccionado(0);
  };

  const handleCobranzaSelect = (cobranzaId: string) => {
    setCobranzaSeleccionada(cobranzaId);
    const cobranza = cobranzas.find(c => c.id === cobranzaId);
    if (cobranza) {
      setMontoSeleccionado(cobranza.montoPendiente + cobranza.montoMora + cobranza.montoInteres);
    }
  };

  const handleRegistrarCobro = () => {
    if (!clienteSeleccionado) {
      Alert.alert('Error', 'Debe seleccionar un cliente primero');
      return;
    }
    if (!cobranzaSeleccionada) {
      Alert.alert('Error', 'Debe seleccionar una cobranza para pagar');
      return;
    }
    if (montoSeleccionado <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a cero');
      return;
    }

    // Navegar a la pantalla de recibo con los datos
    navigation.navigate('Recibo', {
      cliente: clienteSeleccionado,
      cobranza: cobranzas.find(c => c.id === cobranzaSeleccionada),
      monto: montoSeleccionado,
      tipo: 'COBRO'
    });
  };

  const calcularTotalCobranzas = () => {
    return cobranzas.reduce((total, cobranza) => 
      total + cobranza.montoPendiente + cobranza.montoMora + cobranza.montoInteres, 0
    );
  };

  const renderCobranza = (cobranza: Cobranza) => {
    const montoTotal = cobranza.montoPendiente + cobranza.montoMora + cobranza.montoInteres;
    const isSelected = cobranzaSeleccionada === cobranza.id;
    const tieneMora = cobranza.diasMora > 0;

    return (
      <TouchableOpacity
        key={cobranza.id}
        onPress={() => handleCobranzaSelect(cobranza.id)}
        style={[styles.cobranzaCard, isSelected && styles.cobranzaCardSelected]}
      >
        <View style={styles.cobranzaHeader}>
          <Text style={styles.cobranzaConcepto}>{cobranza.concepto}</Text>
          {cobranza.numeroCuota && (
            <Text style={styles.cobranzaCuota}>Cuota {cobranza.numeroCuota}</Text>
          )}
        </View>
        
        <View style={styles.cobranzaDetalles}>
          <View style={styles.cobranzaRow}>
            <Text style={styles.cobranzaLabel}>Monto Principal:</Text>
            <Text style={styles.cobranzaMonto}>${cobranza.montoPendiente.toFixed(2)}</Text>
          </View>
          
          {cobranza.montoInteres > 0 && (
            <View style={styles.cobranzaRow}>
              <Text style={styles.cobranzaLabel}>Interés:</Text>
              <Text style={styles.cobranzaMonto}>${cobranza.montoInteres.toFixed(2)}</Text>
            </View>
          )}
          
          {cobranza.montoMora > 0 && (
            <View style={styles.cobranzaRow}>
              <Text style={[styles.cobranzaLabel, styles.moraLabel]}>Mora ({cobranza.diasMora} días):</Text>
              <Text style={[styles.cobranzaMonto, styles.moraMonto]}>${cobranza.montoMora.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={[styles.cobranzaRow, styles.cobranzaTotal]}>
            <Text style={styles.cobranzaTotalLabel}>Total:</Text>
            <Text style={styles.cobranzaTotalMonto}>${montoTotal.toFixed(2)}</Text>
          </View>
        </View>

        {tieneMora && (
          <View style={styles.moraBadge}>
            <Text style={styles.moraBadgeText}>EN MORA</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
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
        </Card>
      )}

      {cobranzas.length > 0 && (
        <>
          <Text style={styles.section}>Cobranzas Pendientes</Text>
          <Text style={styles.totalText}>
            Total a cobrar: ${calcularTotalCobranzas().toFixed(2)}
          </Text>
          
          {cobranzas.map(renderCobranza)}
        </>
      )}

      {clienteSeleccionado && cobranzas.length === 0 && (
        <Card style={styles.noCobranzasCard}>
          <Text style={styles.noCobranzasText}>No hay cobranzas pendientes</Text>
          <Text style={styles.noCobranzasSubtext}>
            Este cliente no tiene deudas pendientes
          </Text>
        </Card>
      )}

      {clienteSeleccionado && cobranzas.length > 0 && (
        <Button 
          title="Registrar Cobro" 
          onPress={handleRegistrarCobro} 
          fullWidth 
          disabled={!cobranzaSeleccionada}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  section: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: theme.colors.text, 
    marginVertical: theme.spacing.md 
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
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
  },
  cobranzaCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.card,
  },
  cobranzaCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F8FF',
  },
  cobranzaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cobranzaConcepto: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  cobranzaCuota: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cobranzaDetalles: {
    marginTop: theme.spacing.sm,
  },
  cobranzaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cobranzaLabel: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  cobranzaMonto: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  moraLabel: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  moraMonto: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  cobranzaTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  cobranzaTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cobranzaTotalMonto: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  moraBadge: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  moraBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  noCobranzasCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  noCobranzasText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noCobranzasSubtext: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    textAlign: 'center',
  },
});


