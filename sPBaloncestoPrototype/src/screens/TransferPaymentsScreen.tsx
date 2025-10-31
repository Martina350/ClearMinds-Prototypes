// Pantalla para ver pagos por transferencia
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface TransferPaymentsScreenProps {
  navigation: any;
}

export const TransferPaymentsScreen: React.FC<TransferPaymentsScreenProps> = ({ navigation }) => {
  const { payments, deportistas } = useApp();

  // Filtrar solo pagos por transferencia
  const transferPayments = payments.filter(payment => payment.paymentMethod === 'transfer');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#24C36B';
      case 'pending': return '#F2AB16';
      case 'under_review': return '#3498db';
      case 'overdue': return '#E62026';
      default: return '#B3B3B3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'under_review': return 'En Revisión';
      case 'overdue': return 'Vencido';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'under_review': return 'hourglass';
      case 'overdue': return 'close-circle';
      default: return 'help-circle';
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const renderPaymentCard = ({ item }: any) => {
    const deportista = deportistas.find(d => d.id === item.deportistaId);
    
    return (
      <View style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{deportista?.name || 'Desconocido'}</Text>
            <Text style={styles.studentCategory}>
              {deportista?.category || 'N/A'} - {deportista?.gender || 'N/A'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#B3B3B3" />
            <Text style={styles.detailLabel}>Monto:</Text>
            <Text style={styles.detailValue}>${item.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color="#B3B3B3" />
            <Text style={styles.detailLabel}>Concepto:</Text>
            <Text style={styles.detailValue}>{item.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#B3B3B3" />
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>
              {item.paymentDate ? formatDate(item.paymentDate) : formatDate(item.createdAt)}
            </Text>
          </View>

          {item.period && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#B3B3B3" />
              <Text style={styles.detailLabel}>Periodo:</Text>
              <Text style={styles.detailValue}>{item.period}</Text>
            </View>
          )}
        </View>

        {item.receiptImage && (
          <View style={styles.receiptSection}>
            <Ionicons name="document-outline" size={16} color="#3498db" />
            <Text style={styles.receiptText}>Comprobante disponible</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSummary = () => {
    const paidCount = transferPayments.filter(p => p.status === 'paid').length;
    const pendingCount = transferPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length;
    const reviewCount = transferPayments.filter(p => p.status === 'under_review').length;
    const totalAmount = transferPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Transferencias</Text>
          <Text style={styles.summaryValue}>{transferPayments.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monto Total</Text>
          <Text style={styles.summaryValue}>${totalAmount}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(36,195,107,0.15)' }]}>
          <Text style={styles.summaryLabel}>Pagadas</Text>
          <Text style={[styles.summaryValue, { color: '#24C36B' }]}>{paidCount}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(243,156,18,0.15)' }]}>
          <Text style={styles.summaryLabel}>Pendientes</Text>
          <Text style={[styles.summaryValue, { color: '#f39c12' }]}>{pendingCount}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(52,152,219,0.15)' }]}>
          <Text style={styles.summaryLabel}>En Revisión</Text>
          <Text style={[styles.summaryValue, { color: '#3498db' }]}>{reviewCount}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderSummary()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listado de Transferencias</Text>
          {transferPayments.length > 0 ? (
            <FlatList
              data={transferPayments}
              renderItem={renderPaymentCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="swap-horizontal-outline" size={64} color="#B3B3B3" />
              <Text style={styles.emptyText}>No hay pagos por transferencia registrados</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  summaryCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    width: '47%',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  paymentCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2D34',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  studentCategory: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  receiptSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2D34',
    gap: 8,
  },
  receiptText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#B3B3B3',
    marginTop: 16,
    textAlign: 'center',
  },
});

