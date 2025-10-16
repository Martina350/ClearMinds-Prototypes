import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../components/Card';
import { DashboardData } from '../../application/use-cases/ObtenerDashboardUseCase';
import { TipoTransaccion } from '../../shared/types';

interface DashboardScreenProps {
  // Se pasará el caso de uso a través de props o context
}

/**
 * Pantalla Dashboard con resumen de actividades
 */
export const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Aquí se llamaría al caso de uso ObtenerDashboardUseCase
      // Por ahora mostramos datos de ejemplo
      const mockData: DashboardData = {
        fecha: new Date(),
        cuentasAperturadas: 3,
        totalDepositos: { cantidad: 5, monto: 150 },
        totalCobros: { cantidad: 2, monto: 80 },
        montoTotalRecaudado: 230,
        historial: [
          { tipo: TipoTransaccion.APERTURA, cantidad: 3, monto: 60 },
          { tipo: TipoTransaccion.DEPOSITO, cantidad: 5, monto: 150 },
          { tipo: TipoTransaccion.COBRO, cantidad: 2, monto: 80 },
        ],
      };
      setData(mockData);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {data.fecha.toLocaleDateString('es-EC', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <Card>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Recaudado</Text>
          <Text style={styles.summaryAmount}>${data.montoTotalRecaudado.toFixed(2)}</Text>
        </View>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{data.cuentasAperturadas}</Text>
          <Text style={styles.statLabel}>Cuentas Aperturadas</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{data.totalDepositos.cantidad}</Text>
          <Text style={styles.statLabel}>Depósitos</Text>
          <Text style={styles.statMonto}>${data.totalDepositos.monto.toFixed(2)}</Text>
        </Card>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{data.totalCobros.cantidad}</Text>
          <Text style={styles.statLabel}>Cobros</Text>
          <Text style={styles.statMonto}>${data.totalCobros.monto.toFixed(2)}</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {data.totalDepositos.cantidad + data.totalCobros.cantidad}
          </Text>
          <Text style={styles.statLabel}>Total Transacciones</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.historialTitle}>Historial Detallado</Text>
        {data.historial.map((item, index) => (
          <View key={index} style={styles.historialItem}>
            <View>
              <Text style={styles.historialTipo}>{item.tipo}</Text>
              <Text style={styles.historialCantidad}>{item.cantidad} transacciones</Text>
            </View>
            <Text style={styles.historialMonto}>${item.monto.toFixed(2)}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  summaryTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statMonto: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  historialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  historialTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historialCantidad: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historialMonto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
});

