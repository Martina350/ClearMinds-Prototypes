// Pantalla de Detalle de Pagos del Estudiante
import React, { useState } from 'react';
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
import { Student, Payment, PaymentHistory } from '../types';

interface PaymentDetailScreenProps {
  navigation: any;
  route: any;
}

export const PaymentDetailScreen: React.FC<PaymentDetailScreenProps> = ({ navigation, route }) => {
  const { student }: { student: Student } = route.params;
  const { payments, paymentHistory } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const studentPayments = payments.filter(payment => payment.studentId === student.id);
  const studentPaymentHistory = paymentHistory.filter(payment => payment.studentId === student.id);

  const pendingPayments = studentPayments.filter(payment => 
    payment.status === 'pending' || payment.status === 'overdue'
  );
  const paidPayments = studentPayments.filter(payment => payment.status === 'paid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'overdue': return '#e74c3c';
      case 'under_review': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      case 'under_review': return 'En revisión';
      default: return 'Desconocido';
    }
  };

  const handlePayment = (payment: Payment) => {
    navigation.navigate('PaymentMethod', { payment, student });
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentDescription}>{item.description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.paymentInfo}>
          <Ionicons name="cash-outline" size={16} color="#7f8c8d" />
          <Text style={styles.paymentAmount}>${item.amount}</Text>
        </View>
        
        <View style={styles.paymentInfo}>
          <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
          <Text style={styles.paymentDate}>Vence: {item.dueDate}</Text>
        </View>

        {item.paymentMethod && (
          <View style={styles.paymentInfo}>
            <Ionicons name="card-outline" size={16} color="#7f8c8d" />
            <Text style={styles.paymentMethod}>
              {item.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
            </Text>
          </View>
        )}

        {item.paymentDate && (
          <View style={styles.paymentInfo}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#27ae60" />
            <Text style={styles.paymentDate}>Pagado: {item.paymentDate}</Text>
          </View>
        )}
      </View>

      {(item.status === 'pending' || item.status === 'overdue') && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePayment(item)}
        >
          <Ionicons name="card-outline" size={20} color="white" />
          <Text style={styles.payButtonText}>Pagar Ahora</Text>
        </TouchableOpacity>
      )}

      {item.status === 'under_review' && (
        <View style={styles.reviewBadge}>
          <Ionicons name="time-outline" size={16} color="#3498db" />
          <Text style={styles.reviewText}>Comprobante en revisión</Text>
        </View>
      )}
    </View>
  );

  const renderHistoryItem = ({ item }: { item: PaymentHistory }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDescription}>{item.description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.historyDetails}>
        <View style={styles.historyInfo}>
          <Ionicons name="cash-outline" size={16} color="#7f8c8d" />
          <Text style={styles.historyAmount}>${item.amount}</Text>
        </View>
        
        {item.paymentDate && (
          <View style={styles.historyInfo}>
            <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
            <Text style={styles.historyDate}>Pagado: {item.paymentDate}</Text>
          </View>
        )}

        {item.paymentMethod && (
          <View style={styles.historyInfo}>
            <Ionicons name="card-outline" size={16} color="#7f8c8d" />
            <Text style={styles.historyMethod}>
              {item.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentCategory}>
          {student.category} - {student.gender}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pendientes ({pendingPayments.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Historial ({studentPaymentHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'pending' ? (
          pendingPayments.length > 0 ? (
            <FlatList
              data={pendingPayments}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={60} color="#27ae60" />
              <Text style={styles.emptyTitle}>¡Todos los pagos al día!</Text>
              <Text style={styles.emptyText}>
                No tienes pagos pendientes para este estudiante.
              </Text>
            </View>
          )
        ) : (
          studentPaymentHistory.length > 0 ? (
            <FlatList
              data={studentPaymentHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={60} color="#bdc3c7" />
              <Text style={styles.emptyTitle}>Sin historial de pagos</Text>
              <Text style={styles.emptyText}>
                El historial de pagos aparecerá aquí.
              </Text>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  studentHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  studentCategory: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#e74c3c',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentDetails: {
    marginBottom: 15,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  paymentAmount: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  paymentDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  paymentMethod: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 12,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 10,
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  historyDetails: {
    marginBottom: 5,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyAmount: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  historyDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  historyMethod: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
