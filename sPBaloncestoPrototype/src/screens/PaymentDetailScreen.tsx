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
  const { payments, paymentHistory, updatePayment } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const deportistaPayments = payments.filter(payment => payment.deportistaId === student.id);
  const deportistaPaymentHistory = paymentHistory.filter(payment => 
    payment.deportistaId === student.id && payment.status === 'paid'
  );

  const pendingPayments = deportistaPayments.filter(payment => 
    payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'under_review'
  );
  const paidPayments = deportistaPayments.filter(payment => payment.status === 'paid');

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

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'mensualidad': return 'Mensualidad';
      case 'inscripcion_torneo': return 'Inscripción Torneo';
      case 'inscripcion_evento': return 'Inscripción Evento';
      default: return 'Pago';
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'mensualidad': return 'calendar-outline';
      case 'inscripcion_torneo': return 'trophy-outline';
      case 'inscripcion_evento': return 'star-outline';
      default: return 'cash-outline';
    }
  };

  const handlePayment = (payment: Payment) => {
    navigation.navigate('PaymentMethod', { payment, student });
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentTitleContainer}>
          <View style={styles.paymentTypeContainer}>
            <Ionicons name={getPaymentTypeIcon(item.type)} size={16} color="#E62026" />
            <Text style={styles.paymentTypeText}>{getPaymentTypeText(item.type)}</Text>
          </View>
          <Text style={styles.paymentDescription}>{item.description}</Text>
        </View>
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
        <Text style={styles.studentName}>Pagos de {student.name}</Text>
        <Text style={styles.studentCategory}>
          {student.category} - {student.gender}
        </Text>
      </View>

      {/* Sección A: Historial de pagos realizados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Pagos Realizados</Text>
        {deportistaPaymentHistory.length > 0 ? (
          <FlatList
            data={deportistaPaymentHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyHistory}>
            <Ionicons name="time-outline" size={40} color="#B3B3B3" />
            <Text style={styles.emptyHistoryText}>Sin historial de pagos</Text>
          </View>
        )}
      </View>

      {/* Sección B: Pagos pendientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos Pendientes</Text>
        {pendingPayments.length > 0 ? (
          <FlatList
            data={pendingPayments}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyPending}>
            <Ionicons name="checkmark-circle" size={40} color="#24C36B" />
            <Text style={styles.emptyPendingText}>¡Todos los pagos al día!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  studentHeader: {
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Gris claro
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginBottom: 5,
  },
  studentCategory: {
    fontSize: 16,
    color: '#B3B3B3', // Gris medio
  },
  section: {
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginBottom: 15,
  },
  paymentCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E62026', // Rojo competitivo para deudas
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  paymentTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentTypeText: {
    fontSize: 12,
    color: '#E62026',
    fontWeight: '600',
    marginLeft: 4,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco
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
    color: '#FFFFFF', // Blanco
  },
  paymentDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  paymentMethod: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E62026', // Rojo competitivo
    borderRadius: 8,
    paddingVertical: 12,
    shadowColor: '#E62026',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2AB16', // Amarillo alerta suave
    borderRadius: 8,
    paddingVertical: 10,
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#0A0D14', // Negro profundo
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#FFFFFF', // Blanco
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
    color: '#FFFFFF', // Blanco
  },
  historyDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  historyMethod: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  transferCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5', // Gris claro
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  transferTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0D14', // Negro profundo
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  transferDescription: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  selectFileButton: {
    borderWidth: 2,
    borderColor: '#E62026', // Rojo competitivo
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  selectFileText: {
    color: '#E62026', // Rojo competitivo
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginTop: 10,
  },
  emptyPending: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPendingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#24C36B', // Verde éxito
    marginTop: 10,
  },
});
