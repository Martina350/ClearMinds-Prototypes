import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { Card } from '../components/Card';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardData {
  fecha: Date;
  cuentasAperturadas: number;
  cuentasBasicasAperturadas: number;
  cuentasInfantilesAperturadas: number;
  cuentasFuturoAperturadas: number;
  totalDepositos: { cantidad: number; monto: number };
  totalCobros: { cantidad: number; monto: number };
  clientesNuevos: number;
  clientesRecurrentes: number;
  montoTotalRecaudado: number;
  promedioTransaccion: number;
  montoMayorTransaccion: number;
  montoMenorTransaccion: number;
  prestamosCobrados: number;
  montoPrestamosCobrados: number;
  cuotasVencidas: number;
  montoMoraRecaudado: number;
  eficienciaCobranza: number;
  tiempoPromedioTransaccion: number;
}

export const ActividadScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [modalVisible, setModalVisible] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData: DashboardData = {
        fecha: new Date(),
        cuentasAperturadas: 5,
        cuentasBasicasAperturadas: 3,
        cuentasInfantilesAperturadas: 1,
        cuentasFuturoAperturadas: 1,
        totalDepositos: { cantidad: 12, monto: 850 },
        totalCobros: { cantidad: 8, monto: 400 },
        clientesNuevos: 3,
        clientesRecurrentes: 2,
        montoTotalRecaudado: 1250,
        promedioTransaccion: 62.5,
        montoMayorTransaccion: 200,
        montoMenorTransaccion: 25,
        prestamosCobrados: 2,
        montoPrestamosCobrados: 300,
        cuotasVencidas: 1,
        montoMoraRecaudado: 15.50,
        eficienciaCobranza: 85.5,
        tiempoPromedioTransaccion: 3.2,
      };
      setData(mockData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7}>
        </TouchableOpacity>
        {<View style={{ alignSelf: 'center' }}>
          <Image
            source={require('../assets/logoSantaTeresita2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard de Actividad</Text>
        <Text style={styles.subtitle}>Resumen de transacciones del día</Text>

        {/* Métricas principales */}
        <View style={styles.grid}>
          <View style={[styles.tile, styles.tileBeige]}>
            <Text style={styles.tileTitle}>Cuentas{`\n`}Aperturadas</Text>
            <Text style={styles.tileValue}>{data.cuentasAperturadas}</Text>
          </View>
          <View style={[styles.tile, styles.tileBeige]}>
            <Text style={styles.tileTitle}>Depósitos</Text>
            <Text style={styles.tileMini}>{data.totalDepositos.cantidad} trans.</Text>
            <Text style={[styles.tileMoney, { color: theme.colors.primary }]}>${data.totalDepositos.monto.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={[styles.tile, styles.tileBeige]}>
            <Text style={styles.tileTitle}>Cobros</Text>
            <Text style={styles.tileMini}>{data.totalCobros.cantidad} trans.</Text>
            <Text style={[styles.tileMoney, { color: theme.colors.primary }]}>${data.totalCobros.monto.toFixed(2)}</Text>
          </View>
          <View style={[styles.tile, styles.tileRed]}>
            <Text style={[styles.tileTitle, { color: '#fff' }]}>Monto total{`\n`}recaudado</Text>
            <Text style={[styles.tileMoney, { color: '#fff', fontSize: 28 }]}>${data.montoTotalRecaudado.toFixed(2)}</Text>
          </View>
        </View>


        <View style={styles.cardWhite}>
          <Text style={styles.section}>Historial Detallado</Text>
          {[
            { icon: 'person-add-alt', bg: '#E7F7EA', title: 'Apertura de Cuentas', c: data.cuentasAperturadas, m: data.cuentasAperturadas * 12 },
            { icon: 'account-balance-wallet', bg: '#E8F0FE', title: 'Depósitos', c: data.totalDepositos.cantidad, m: data.totalDepositos.monto },
            { icon: 'receipt-long', bg: '#FFF3E0', title: 'Cobros', c: data.totalCobros.cantidad, m: data.totalCobros.monto },
          ].map((i, idx) => (
            <View key={idx} style={styles.histRow}>
              <View style={[styles.circle, { backgroundColor: i.bg }]}>
                <MaterialIcons name={i.icon as any} size={24} color={theme.colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{i.title}</Text>
                <Text style={styles.rowSub}>{i.c} transacciones</Text>
              </View>
              <Text style={styles.rowAmount}>${i.m.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionBig}>Resumen General</Text>
        <View style={[styles.tileBeige, styles.consolidado]}>
          <TouchableOpacity style={styles.consRow} onPress={() => setModalVisible('cuentas')}>
            <Text style={styles.consLabel}>Cantidad de Cuentas Aperturadas</Text>
            <Text style={styles.consValue}>{data.cuentasAperturadas}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.consRow} onPress={() => setModalVisible('depositos')}>
            <Text style={styles.consLabel}>Monto por Depósitos</Text>
            <Text style={styles.consValue}>${data.totalDepositos.monto.toFixed(2)}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.consRow} onPress={() => setModalVisible('cobros')}>
            <Text style={styles.consLabel}>Monto por Cobros</Text>
            <Text style={styles.consValue}>${data.totalCobros.monto.toFixed(2)}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.consRow} onPress={() => setModalVisible('prestamos')}>
            <Text style={styles.consLabel}>Préstamos Cobrados</Text>
            <Text style={styles.consValue}>${data.montoPrestamosCobrados.toFixed(2)}</Text>
          </TouchableOpacity>
          <View style={[styles.divider, styles.dividerRed]} />
          <View style={styles.consRow}>
            <Text style={[styles.consLabel, styles.totalGeneralText]}>Total General</Text>
            <Text style={[styles.consValue, styles.totalGeneralText]}>${data.montoTotalRecaudado.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Cuentas */}
      <Modal
        visible={modalVisible === 'cuentas'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cuentas Aperturadas</Text>
              <TouchableOpacity onPress={() => setModalVisible(null)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Básicas:</Text>
                <Text style={styles.modalValue}>{data.cuentasBasicasAperturadas}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Infantiles:</Text>
                <Text style={styles.modalValue}>{data.cuentasInfantilesAperturadas}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Futuro:</Text>
                <Text style={styles.modalValue}>{data.cuentasFuturoAperturadas}</Text>
              </View>
              <View style={[styles.modalRow, styles.modalTotal]}>
                <Text style={[styles.modalLabel, styles.modalTotalLabel]}>Total:</Text>
                <Text style={[styles.modalValue, styles.modalTotalValue]}>{data.cuentasAperturadas}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Depósitos */}
      <Modal
        visible={modalVisible === 'depositos'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Depósitos</Text>
              <TouchableOpacity onPress={() => setModalVisible(null)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Cantidad:</Text>
                <Text style={styles.modalValue}>{data.totalDepositos.cantidad} transacciones</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Monto Total:</Text>
                <Text style={styles.modalValue}>${data.totalDepositos.monto.toFixed(2)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Promedio:</Text>
                <Text style={styles.modalValue}>${data.promedioTransaccion.toFixed(2)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Mayor Depósito:</Text>
                <Text style={styles.modalValue}>${data.montoMayorTransaccion.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Cobros */}
      <Modal
        visible={modalVisible === 'cobros'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cobros</Text>
              <TouchableOpacity onPress={() => setModalVisible(null)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Cantidad:</Text>
                <Text style={styles.modalValue}>{data.totalCobros.cantidad} transacciones</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Monto Total:</Text>
                <Text style={styles.modalValue}>${data.totalCobros.monto.toFixed(2)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Cobros Pendientes:</Text>
                <Text style={styles.modalValue}>{data.cuotasVencidas}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Mora Recaudada:</Text>
                <Text style={styles.modalValue}>${data.montoMoraRecaudado.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Préstamos */}
      <Modal
        visible={modalVisible === 'prestamos'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Préstamos y Cobranzas</Text>
              <TouchableOpacity onPress={() => setModalVisible(null)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Préstamos Cobrados:</Text>
                <Text style={styles.modalValue}>{data.prestamosCobrados}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Monto Cobrado:</Text>
                <Text style={styles.modalValue}>${data.montoPrestamosCobrados.toFixed(2)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Cuotas Vencidas:</Text>
                <Text style={styles.modalValue}>{data.cuotasVencidas}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Mora Recaudada:</Text>
                <Text style={styles.modalValue}>${data.montoMoraRecaudado.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 15, paddingBottom: 15, backgroundColor: theme.colors.background },
  topTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  scrollContent: { padding: 16, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.primary, textAlign: 'center' },
  logo: { width: 340, height: 36, resizeMode: 'contain', alignSelf: 'center' },
  subtitle: { textAlign: 'center', color: theme.colors.subtitle, marginTop: 4, marginBottom: theme.spacing.lg },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
  tile: { flex: 1, marginHorizontal: 6, borderRadius: 20, paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.md, ...theme.shadows.card },
  tileBeige: { backgroundColor: '#FFFFFF' },
  tileRed: { backgroundColor: theme.colors.primary },
  tileTitle: { color: theme.colors.text, fontWeight: '900' },
  tileMini: { color: theme.colors.subtitle, marginTop: 6, fontWeight: '700' },
  tileValue: { color: theme.colors.primary, fontSize: 28, fontWeight: '900', position: 'absolute', right: 16, bottom: 14 },
  tileMoney: { fontSize: 24, fontWeight: '900', marginTop: 6 },
  cardWhite: { backgroundColor: theme.colors.background, borderRadius: 20, padding: theme.spacing.lg, ...theme.shadows.card, marginBottom: theme.spacing.lg },
  section: { fontSize: 22, fontWeight: '900', color: theme.colors.text, marginBottom: theme.spacing.md },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  rowTitle: { fontWeight: '900', color: theme.colors.text },
  rowSub: { color: theme.colors.subtitle, marginTop: 2 },
  rowAmount: { fontWeight: '900', color: theme.colors.text },
  sectionBig: { fontSize: 24, fontWeight: '900', color: theme.colors.text, marginBottom: theme.spacing.md },
  consolidado: { borderRadius: 20, padding: theme.spacing.lg, ...theme.shadows.card },
  consRow: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EADCCC' },
  dividerRed: { backgroundColor: theme.colors.primary, height: 2, marginTop: 4 },
  consLabel: { color: theme.colors.text, fontWeight: '900' },
  consValue: { color: theme.colors.text, fontWeight: '900' },
  totalGeneralText: { color: theme.colors.primary },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    maxWidth: '90%',
    width: '100%',
    ...theme.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalBody: {
    marginTop: theme.spacing.md,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  modalTotal: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  modalTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});


