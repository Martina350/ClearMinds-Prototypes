// Pantalla para ver pagos por tarjeta
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

interface CardPayment {
  id: string;
  studentName: string;
  category: string;
  amount: number;
  cardNumber: string;
  paymentDate: string;
  status: 'approved' | 'pending' | 'rejected';
  transactionId: string;
}

const mockCardPayments: CardPayment[] = [
  {
    id: '1',
    studentName: 'Juan Pérez',
    category: 'Sub-15 Masculino',
    amount: 30,
    cardNumber: '**** **** **** 1234',
    paymentDate: '2024-01-15',
    status: 'approved',
    transactionId: 'TXN-001234',
  },
  {
    id: '2',
    studentName: 'María García',
    category: 'Sub-13 Femenino',
    amount: 30,
    cardNumber: '**** **** **** 5678',
    paymentDate: '2024-01-14',
    status: 'pending',
    transactionId: 'TXN-001235',
  },
  {
    id: '3',
    studentName: 'Carlos López',
    category: 'Sub-17 Masculino',
    amount: 30,
    cardNumber: '**** **** **** 9012',
    paymentDate: '2024-01-13',
    status: 'rejected',
    transactionId: 'TXN-001236',
  },
];

interface CardPaymentsScreenProps {
  navigation: any;
}

export const CardPaymentsScreen: React.FC<CardPaymentsScreenProps> = ({ navigation }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#24C36B';
      case 'pending': return '#F2AB16';
      case 'rejected': return '#E62026';
      default: return '#B3B3B3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  // Pagos con tarjeta son informativos (ya liquidados), no se aprueban/rechazan

  const renderPaymentCard = ({ item }: { item: CardPayment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.studentCategory}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="card" size={16} color="#E62026" />
          <Text style={styles.detailLabel}>Tarjeta:</Text>
          <Text style={styles.detailValue}>{item.cardNumber}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#E62026" />
          <Text style={styles.detailLabel}>Monto:</Text>
          <Text style={styles.detailValue}>${item.amount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#E62026" />
          <Text style={styles.detailLabel}>Fecha:</Text>
          <Text style={styles.detailValue}>{item.paymentDate}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="receipt" size={16} color="#E62026" />
          <Text style={styles.detailLabel}>ID Transacción:</Text>
          <Text style={styles.detailValue}>{item.transactionId}</Text>
        </View>
      </View>

      {/* Sin acciones: pagos con tarjeta ya están procesados */}
    </View>
  );

  // Filtros removidos

  return (
    <View style={styles.container}>
      {/* Filtros removidos */}

      {/* Lista de pagos */}
      <FlatList
        data={mockCardPayments}
        renderItem={renderPaymentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#B3B3B3" />
            <Text style={styles.emptyTitle}>No hay pagos por tarjeta</Text>
            <Text style={styles.emptyText}>No se encontraron pagos por tarjeta</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
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
    flexWrap: 'wrap',
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
  listContainer: {
    padding: 20,
  },
  paymentCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    minWidth: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#24C36B',
  },
  rejectButton: {
    backgroundColor: '#E62026',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 20,
  },
});
