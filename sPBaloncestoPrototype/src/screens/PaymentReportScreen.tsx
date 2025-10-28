// Pantalla para reporte de pagos
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  approvedPayments: number;
  pendingPayments: number;
  rejectedPayments: number;
  cardPayments: number;
  transferPayments: number;
  monthlyStats: {
    month: string;
    payments: number;
    amount: number;
  }[];
}

const mockStats: PaymentStats = {
  totalPayments: 156,
  totalAmount: 4680,
  approvedPayments: 142,
  pendingPayments: 8,
  rejectedPayments: 6,
  cardPayments: 98,
  transferPayments: 58,
  monthlyStats: [
    { month: 'Enero 2024', payments: 45, amount: 1350 },
    { month: 'Febrero 2024', payments: 52, amount: 1560 },
    { month: 'Marzo 2024', payments: 38, amount: 1140 },
    { month: 'Abril 2024', payments: 21, amount: 630 },
  ],
};

interface PaymentReportScreenProps {
  navigation: any;
}

export const PaymentReportScreen: React.FC<PaymentReportScreenProps> = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const handleExportReport = (format: 'pdf' | 'excel') => {
    Alert.alert(
      'Exportar Reporte',
      `¿Exportar reporte en formato ${format.toUpperCase()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => {
            // Aquí iría la lógica para exportar el reporte
            Alert.alert('Éxito', `Reporte exportado en formato ${format.toUpperCase()}`);
          }
        }
      ]
    );
  };

  const handleSendEmail = () => {
    Alert.alert(
      'Enviar por Email',
      '¿Enviar el reporte por correo electrónico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            // Aquí iría la lógica para enviar por email
            Alert.alert('Éxito', 'Reporte enviado por correo electrónico');
          }
        }
      ]
    );
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const renderMonthlyStat = (stat: { month: string; payments: number; amount: number }) => (
    <View key={stat.month} style={styles.monthlyCard}>
      <Text style={styles.monthlyTitle}>{stat.month}</Text>
      <View style={styles.monthlyStats}>
        <View style={styles.monthlyStat}>
          <Text style={styles.monthlyStatValue}>{stat.payments}</Text>
          <Text style={styles.monthlyStatLabel}>Pagos</Text>
        </View>
        <View style={styles.monthlyStat}>
          <Text style={styles.monthlyStatValue}>${stat.amount}</Text>
          <Text style={styles.monthlyStatLabel}>Monto</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header con acciones */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reporte de Pagos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleExportReport('pdf')}
          >
            <Ionicons name="document-text" size={20} color="#E62026" />
            <Text style={styles.actionButtonText}>PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleExportReport('excel')}
          >
            <Ionicons name="document" size={20} color="#E62026" />
            <Text style={styles.actionButtonText}>Excel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSendEmail}
          >
            <Ionicons name="mail" size={20} color="#E62026" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros de período */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Período:</Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPeriod === 'month' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPeriod === 'month' && styles.filterButtonTextActive
            ]}>
              Mensual
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPeriod === 'quarter' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedPeriod('quarter')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPeriod === 'quarter' && styles.filterButtonTextActive
            ]}>
              Trimestral
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedPeriod === 'year' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPeriod === 'year' && styles.filterButtonTextActive
            ]}>
              Anual
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas generales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Pagos', mockStats.totalPayments, 'receipt', '#E62026')}
          {renderStatCard('Monto Total', `$${mockStats.totalAmount}`, 'cash', '#24C36B')}
          {renderStatCard('Aprobados', mockStats.approvedPayments, 'checkmark-circle', '#24C36B')}
          {renderStatCard('Pendientes', mockStats.pendingPayments, 'time', '#F2AB16')}
          {renderStatCard('Rechazados', mockStats.rejectedPayments, 'close-circle', '#E62026')}
          {renderStatCard('Por Tarjeta', mockStats.cardPayments, 'card', '#E62026')}
          {renderStatCard('Transferencias', mockStats.transferPayments, 'swap-horizontal', '#24C36B')}
        </View>
      </View>

      {/* Estadísticas por método de pago */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por Método de Pago</Text>
        <View style={styles.methodStatsContainer}>
          <View style={styles.methodStat}>
            <View style={styles.methodStatHeader}>
              <Ionicons name="card" size={20} color="#E62026" />
              <Text style={styles.methodStatTitle}>Tarjeta de Crédito</Text>
            </View>
            <Text style={styles.methodStatValue}>{mockStats.cardPayments} pagos</Text>
            <Text style={styles.methodStatPercentage}>
              {Math.round((mockStats.cardPayments / mockStats.totalPayments) * 100)}%
            </Text>
          </View>
          
          <View style={styles.methodStat}>
            <View style={styles.methodStatHeader}>
              <Ionicons name="swap-horizontal" size={20} color="#24C36B" />
              <Text style={styles.methodStatTitle}>Transferencia</Text>
            </View>
            <Text style={styles.methodStatValue}>{mockStats.transferPayments} pagos</Text>
            <Text style={styles.methodStatPercentage}>
              {Math.round((mockStats.transferPayments / mockStats.totalPayments) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas mensuales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas Mensuales</Text>
        {mockStats.monthlyStats.map(renderMonthlyStat)}
      </View>

      {/* Gráfico de tendencias (placeholder) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendencia de Pagos</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={48} color="#B3B3B3" />
          <Text style={styles.chartPlaceholderText}>Gráfico de tendencias</Text>
          <Text style={styles.chartPlaceholderSubtext}>
            Aquí se mostraría un gráfico con la evolución de los pagos
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1D24', // Card oscuro
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E62026',
    gap: 4,
  },
  actionButtonText: {
    color: '#E62026',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filtersContainer: {
    padding: 20,
    backgroundColor: '#1A1D24', // Card oscuro
    marginBottom: 10,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2A2D34',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterButtonActive: {
    backgroundColor: '#E62026',
    borderColor: '#E62026',
  },
  filterButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#B3B3B3',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  methodStatsContainer: {
    gap: 16,
  },
  methodStat: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  methodStatTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  methodStatValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  methodStatPercentage: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  monthlyCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  monthlyStat: {
    alignItems: 'center',
  },
  monthlyStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E62026',
    marginBottom: 4,
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  chartPlaceholder: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});
