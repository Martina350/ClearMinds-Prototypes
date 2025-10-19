import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  numeroCuenta?: string;
  saldo?: number;
  avatar: string;
}

export const ConsultasClientesScreen: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Base de datos de clientes más completa
  const clientes: Cliente[] = [
    { 
      id: '1', 
      nombre: 'María', 
      apellidos: 'Rodríguez', 
      cedula: '1234567890', 
      telefono: '0987654321',
      numeroCuenta: 'CA-001-2024',
      saldo: 150.50,
      avatar: 'https://dummyimage.com/80x80/fbe9e7/ffffff&text=👩' 
    },
    { 
      id: '2', 
      nombre: 'Carlos', 
      apellidos: 'Pérez', 
      cedula: '0987654321', 
      telefono: '0998765432',
      numeroCuenta: 'CA-002-2024',
      saldo: 275.75,
      avatar: 'https://dummyimage.com/80x80/e3f2fd/ffffff&text=👨' 
    },
    { 
      id: '3', 
      nombre: 'Ana', 
      apellidos: 'García', 
      cedula: '1122334455', 
      telefono: '0976543210',
      numeroCuenta: 'CA-003-2024',
      saldo: 89.25,
      avatar: 'https://dummyimage.com/80x80/fff3e0/ffffff&text=👩' 
    },
    { 
      id: '4', 
      nombre: 'Luis', 
      apellidos: 'Martínez', 
      cedula: '5566778899', 
      telefono: '0965432109',
      numeroCuenta: 'CA-004-2024',
      saldo: 420.00,
      avatar: 'https://dummyimage.com/80x80/e8f5e8/ffffff&text=👨' 
    },
    { 
      id: '5', 
      nombre: 'Carmen', 
      apellidos: 'López', 
      cedula: '9988776655', 
      telefono: '0954321098',
      numeroCuenta: 'CA-005-2024',
      saldo: 125.30,
      avatar: 'https://dummyimage.com/80x80/f3e5f5/ffffff&text=👩' 
    },
  ];

  // Filtrar clientes basado en la búsqueda
  const resultados = useMemo(() => {
    if (!busqueda.trim()) {
      return clientes;
    }
    
    const terminoBusqueda = busqueda.toLowerCase().trim();
    
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(terminoBusqueda) ||
      cliente.apellidos.toLowerCase().includes(terminoBusqueda) ||
      cliente.cedula.includes(terminoBusqueda) ||
      cliente.telefono.includes(terminoBusqueda) ||
      (cliente.numeroCuenta && cliente.numeroCuenta.toLowerCase().includes(terminoBusqueda))
    );
  }, [busqueda]);

  // Función para abrir el modal con información del cliente
  const abrirModalCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalVisible(true);
  };

  // Datos de ejemplo para el historial del cliente
  const obtenerHistorialCliente = (clienteId: string) => {
    const historiales = {
      '1': {
        depositos: [
          { fecha: '2024-01-15', monto: 50.00, concepto: 'Depósito inicial' },
          { fecha: '2024-01-20', monto: 25.00, concepto: 'Ahorro semanal' },
          { fecha: '2024-01-25', monto: 75.50, concepto: 'Depósito adicional' }
        ],
        cobros: [
          { fecha: '2024-01-10', monto: 15.00, concepto: 'Cuota préstamo' },
          { fecha: '2024-01-18', monto: 8.50, concepto: 'Mora préstamo' }
        ],
        prestamos: [
          { fecha: '2024-01-05', monto: 200.00, saldo: 150.00, estado: 'Activo' }
        ]
      },
      '2': {
        depositos: [
          { fecha: '2024-01-12', monto: 100.00, concepto: 'Depósito inicial' },
          { fecha: '2024-01-22', monto: 50.00, concepto: 'Ahorro mensual' },
          { fecha: '2024-01-28', monto: 125.75, concepto: 'Depósito adicional' }
        ],
        cobros: [
          { fecha: '2024-01-08', monto: 30.00, concepto: 'Cuota préstamo' },
          { fecha: '2024-01-20', monto: 12.00, concepto: 'Mora préstamo' }
        ],
        prestamos: [
          { fecha: '2024-01-03', monto: 500.00, saldo: 275.00, estado: 'Activo' }
        ]
      },
      '3': {
        depositos: [
          { fecha: '2024-01-18', monto: 30.00, concepto: 'Depósito inicial' },
          { fecha: '2024-01-25', monto: 59.25, concepto: 'Ahorro semanal' }
        ],
        cobros: [],
        prestamos: []
      },
      '4': {
        depositos: [
          { fecha: '2024-01-10', monto: 200.00, concepto: 'Depósito inicial' },
          { fecha: '2024-01-20', monto: 100.00, concepto: 'Ahorro mensual' },
          { fecha: '2024-01-30', monto: 120.00, concepto: 'Depósito adicional' }
        ],
        cobros: [
          { fecha: '2024-01-15', monto: 45.00, concepto: 'Cuota préstamo' }
        ],
        prestamos: [
          { fecha: '2024-01-08', monto: 800.00, saldo: 420.00, estado: 'Activo' }
        ]
      },
      '5': {
        depositos: [
          { fecha: '2024-01-14', monto: 75.00, concepto: 'Depósito inicial' },
          { fecha: '2024-01-24', monto: 50.30, concepto: 'Ahorro quincenal' }
        ],
        cobros: [
          { fecha: '2024-01-12', monto: 20.00, concepto: 'Cuota préstamo' }
        ],
        prestamos: [
          { fecha: '2024-01-06', monto: 300.00, saldo: 125.00, estado: 'Activo' }
        ]
      }
    };
    return historiales[clienteId as keyof typeof historiales] || { depositos: [], cobros: [], prestamos: [] };
  };

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Input 
        label="Buscar Cliente" 
        placeholder="Cédula, nombre, apellido, teléfono o número de cuenta" 
        value={busqueda} 
        onChangeText={setBusqueda} 
      />

      <Text style={styles.header}>
        {busqueda.trim() ? `Resultados (${resultados.length})` : 'Todos los Clientes'}
      </Text>
      
      {resultados.length === 0 && busqueda.trim() ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No se encontraron clientes</Text>
          <Text style={styles.noResultsSub}>Intenta con otros términos de búsqueda</Text>
        </View>
      ) : (
        resultados.map((cliente) => (
          <TouchableOpacity 
            key={cliente.id} 
            style={styles.item} 
            onPress={() => abrirModalCliente(cliente)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: cliente.avatar }} style={styles.avatar} />
            <View style={styles.clienteInfo}>
              <Text style={styles.name}>{cliente.nombre} {cliente.apellidos}</Text>
              <Text style={styles.sub}>Cédula: {cliente.cedula}</Text>
              <Text style={styles.sub}>Teléfono: {cliente.telefono}</Text>
              {cliente.numeroCuenta && (
                <Text style={styles.sub}>Cuenta: {cliente.numeroCuenta}</Text>
              )}
              {cliente.saldo !== undefined && (
                <Text style={styles.saldo}>Saldo: ${cliente.saldo.toFixed(2)}</Text>
              )}
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.primaryLight} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>

    {/* Modal de información del cliente */}
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {clienteSeleccionado && (
            <>
              {/* Header del modal */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderInfo}>
                  <Image source={{ uri: clienteSeleccionado.avatar }} style={styles.modalAvatar} />
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalTitle}>{clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}</Text>
                    <Text style={styles.modalSubtitle}>Cédula: {clienteSeleccionado.cedula}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Información básica */}
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Información Personal</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{clienteSeleccionado.telefono}</Text>
                  </View>
                  {clienteSeleccionado.numeroCuenta && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Cuenta:</Text>
                      <Text style={styles.infoValue}>{clienteSeleccionado.numeroCuenta}</Text>
                    </View>
                  )}
                  {clienteSeleccionado.saldo !== undefined && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Saldo Actual:</Text>
                      <Text style={[styles.infoValue, styles.saldoValue]}>${clienteSeleccionado.saldo.toFixed(2)}</Text>
                    </View>
                  )}
                </View>

                {/* Historial de depósitos */}
                {(() => {
                  const historial = obtenerHistorialCliente(clienteSeleccionado.id);
                  return (
                    <>
                      {historial.depositos.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Depósitos Recientes</Text>
                          {historial.depositos.map((deposito, index) => (
                            <View key={index} style={styles.transactionRow}>
                              <View style={styles.transactionInfo}>
                                <Text style={styles.transactionConcept}>{deposito.concepto}</Text>
                                <Text style={styles.transactionDate}>{deposito.fecha}</Text>
                              </View>
                              <Text style={styles.transactionAmount}>+${deposito.monto.toFixed(2)}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Historial de cobros */}
                      {historial.cobros.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Cobros Recientes</Text>
                          {historial.cobros.map((cobro, index) => (
                            <View key={index} style={styles.transactionRow}>
                              <View style={styles.transactionInfo}>
                                <Text style={styles.transactionConcept}>{cobro.concepto}</Text>
                                <Text style={styles.transactionDate}>{cobro.fecha}</Text>
                              </View>
                              <Text style={[styles.transactionAmount, styles.cobroAmount]}>-${cobro.monto.toFixed(2)}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Préstamos activos */}
                      {historial.prestamos.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Préstamos Activos</Text>
                          {historial.prestamos.map((prestamo, index) => (
                            <View key={index} style={styles.prestamoRow}>
                              <View style={styles.prestamoInfo}>
                                <Text style={styles.prestamoMonto}>Monto Original: ${prestamo.monto.toFixed(2)}</Text>
                                <Text style={styles.prestamoSaldo}>Saldo Pendiente: ${prestamo.saldo.toFixed(2)}</Text>
                                <Text style={styles.prestamoEstado}>Estado: {prestamo.estado}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  );
                })()}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  header: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: theme.colors.text, 
    marginVertical: theme.spacing.md 
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    backgroundColor: theme.colors.background, 
    borderRadius: theme.radii.lg, 
    padding: theme.spacing.md, 
    marginBottom: theme.spacing.sm, 
    ...theme.shadows.card 
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28 
  },
  clienteInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: theme.colors.text,
    marginBottom: 4
  },
  sub: { 
    color: theme.colors.primaryLight, 
    fontSize: 14,
    marginBottom: 2
  },
  saldo: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4
  },
  noResults: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    marginTop: theme.spacing.md,
    ...theme.shadows.card
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  },
  noResultsSub: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    textAlign: 'center'
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    margin: theme.spacing.lg,
    maxWidth: '95%',
    width: '100%',
    maxHeight: '90%',
    ...theme.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  modalHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginTop: 2,
  },
  modalBody: {
    maxHeight: 400,
  },
  modalSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  saldoValue: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionConcept: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cobroAmount: {
    color: '#E53E3E',
  },
  prestamoRow: {
    backgroundColor: '#F8F9FA',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  prestamoInfo: {
    flex: 1,
  },
  prestamoMonto: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  prestamoSaldo: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  prestamoEstado: {
    fontSize: 14,
    color: theme.colors.primaryLight,
  },
});


