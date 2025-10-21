import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Input } from '../components/Input';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { mockDB } from '../../infrastructure/persistence/MockDatabase';

interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  numeroCuenta?: string;
  saldo?: number;
  avatar: any;
}

export const ConsultasClientesScreen: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const isFocused = useIsFocused();
  
  // Función para cargar clientes
  const cargarClientes = () => {
    const clientesDB = mockDB.getClientes();
    const clientesMapeados: Cliente[] = clientesDB.map(clienteDB => {
      const cuentas = mockDB.getCuentasByCliente(clienteDB.id);
      const cuentaPrincipal = cuentas.find(c => c.tipo === 'BASICA') || cuentas[0];
      
      return {
        id: clienteDB.id,
        nombre: clienteDB.nombre,
        apellidos: clienteDB.apellidos,
        cedula: clienteDB.cedula,
        telefono: clienteDB.celular,
        numeroCuenta: cuentaPrincipal?.numeroCuenta,
        saldo: cuentaPrincipal?.saldo,
        avatar: require('../assets/icon.png'),
      };
    });
    setClientes(clientesMapeados);
  };

  // Función para obtener información detallada de cuentas del cliente
  const obtenerCuentasCliente = (clienteId: string) => {
    const cuentas = mockDB.getCuentasByCliente(clienteId);
    
    const cuentaBasica = cuentas.find(c => c.tipo === 'BASICA');
    const cuentaInfantil = cuentas.find(c => c.tipo === 'INFANTIL');
    const cuentaFuturo = cuentas.find(c => c.tipo === 'AHORRO_FUTURO');
    
    return {
      cuentaBasica,
      cuentaInfantil,
      cuentaFuturo,
      todasLasCuentas: cuentas
    };
  };

  // Recargar clientes cuando la pantalla recibe el foco
  useEffect(() => {
    if (isFocused) {
      cargarClientes();
    }
  }, [isFocused]);

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

  // Obtener historial real del cliente desde la base de datos
  const obtenerHistorialCliente = (clienteId: string) => {
    // Obtener transacciones del cliente
    const transacciones = mockDB.getTransaccionesByCliente(clienteId);
    
    // Separar por tipo
    const depositos = transacciones
      .filter(t => t.tipo === 'DEPOSITO')
      .map(t => ({
        fecha: t.fecha,
        monto: t.monto,
        concepto: t.concepto,
      }));
    
    const cobros = transacciones
      .filter(t => t.tipo === 'COBRO')
      .map(t => ({
        fecha: t.fecha,
        monto: t.monto,
        concepto: t.concepto,
      }));
    
    // Obtener préstamos del cliente
    const prestamosDB = mockDB.getPrestamosByCliente(clienteId);
    const prestamos = prestamosDB.map(p => ({
      fecha: p.fechaInicio,
      monto: p.montoTotal,
      saldo: p.saldoPendiente,
      estado: p.estado === 'ACTIVO' ? 'Activo' : p.estado === 'PAGADO' ? 'Pagado' : 'Vencido',
    }));
    
    return { depositos, cobros, prestamos };
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
            <Image source={cliente.avatar} style={styles.avatar} />
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
                  <Image source={clienteSeleccionado.avatar} style={styles.modalAvatar} />
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
                </View>

                {/* Información de Cuentas */}
                {(() => {
                  const cuentasInfo = obtenerCuentasCliente(clienteSeleccionado.id);
                  return (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Cuentas del Cliente</Text>
                      
                      {/* Cuenta Básica */}
                      {cuentasInfo.cuentaBasica && (
                        <View style={styles.cuentaCard}>
                          <View style={styles.cuentaHeader}>
                            <Text style={styles.cuentaTipo}>Cuenta Básica</Text>
                            <View style={[styles.tipoBadge, styles.basicaBadge]}>
                              <Text style={styles.tipoBadgeText}>BÁSICA</Text>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Número:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaBasica.numeroCuenta}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Saldo:</Text>
                            <Text style={[styles.infoValue, styles.saldoValue]}>${cuentasInfo.cuentaBasica.saldo.toFixed(2)}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Estado:</Text>
                            <Text style={[styles.infoValue, { color: cuentasInfo.cuentaBasica.estado === 'ACTIVA' ? '#4CAF50' : '#F44336' }]}>
                              {cuentasInfo.cuentaBasica.estado}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fecha Apertura:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaBasica.fechaApertura}</Text>
                          </View>
                        </View>
                      )}

                      {/* Cuenta Infantil */}
                      {cuentasInfo.cuentaInfantil && (
                        <View style={styles.cuentaCard}>
                          <View style={styles.cuentaHeader}>
                            <Text style={styles.cuentaTipo}>Cuenta Infantil</Text>
                            <View style={[styles.tipoBadge, styles.infantilBadge]}>
                              <Text style={styles.tipoBadgeText}>INFANTIL</Text>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Número:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaInfantil.numeroCuenta}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Saldo:</Text>
                            <Text style={[styles.infoValue, styles.saldoValue]}>${cuentasInfo.cuentaInfantil.saldo.toFixed(2)}</Text>
                          </View>
                          {cuentasInfo.cuentaInfantil.titularMenor && (
                            <View style={styles.infoRow}>
                              <Text style={styles.infoLabel}>Titular (Menor):</Text>
                              <Text style={styles.infoValue}>
                                {cuentasInfo.cuentaInfantil.titularMenor.nombre} {cuentasInfo.cuentaInfantil.titularMenor.apellidos}
                              </Text>
                            </View>
                          )}
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Relación:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaInfantil.relacion || 'No especificada'}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Estado:</Text>
                            <Text style={[styles.infoValue, { color: cuentasInfo.cuentaInfantil.estado === 'ACTIVA' ? '#4CAF50' : '#F44336' }]}>
                              {cuentasInfo.cuentaInfantil.estado}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Cuenta Ahorro Futuro */}
                      {cuentasInfo.cuentaFuturo && (
                        <View style={styles.cuentaCard}>
                          <View style={styles.cuentaHeader}>
                            <Text style={styles.cuentaTipo}>Ahorro Futuro</Text>
                            <View style={[styles.tipoBadge, styles.futuroBadge]}>
                              <Text style={styles.tipoBadgeText}>FUTURO</Text>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Número:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaFuturo.numeroCuenta}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Monto Invertido:</Text>
                            <Text style={[styles.infoValue, styles.saldoValue]}>${cuentasInfo.cuentaFuturo.saldo.toFixed(2)}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Plazo:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaFuturo.plazo} días</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Tasa de Interés:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaFuturo.tasaInteres}%</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fecha Vencimiento:</Text>
                            <Text style={styles.infoValue}>{cuentasInfo.cuentaFuturo.fechaVencimiento}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Estado:</Text>
                            <Text style={[styles.infoValue, { color: cuentasInfo.cuentaFuturo.estado === 'ACTIVA' ? '#4CAF50' : '#F44336' }]}>
                              {cuentasInfo.cuentaFuturo.estado}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Si no tiene cuentas */}
                      {cuentasInfo.todasLasCuentas.length === 0 && (
                        <View style={styles.noCuentasCard}>
                          <Text style={styles.noCuentasText}>El cliente no tiene cuentas registradas</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

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
  // Estilos para las cuentas
  cuentaCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cuentaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cuentaTipo: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  basicaBadge: {
    backgroundColor: '#E3F2FD',
  },
  infantilBadge: {
    backgroundColor: '#FFF3E0',
  },
  futuroBadge: {
    backgroundColor: '#E8F5E8',
  },
  tipoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  noCuentasCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  noCuentasText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    textAlign: 'center',
  },
});


