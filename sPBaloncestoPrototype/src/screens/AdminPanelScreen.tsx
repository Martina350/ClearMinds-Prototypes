// Panel Administrativo Móvil
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
import { Payment, Student, Championship, Match } from '../types';

interface AdminPanelScreenProps {
  navigation: any;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({ navigation }) => {
  const { students, payments, championships } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard'>('dashboard');

  // Cálculos para el dashboard
  const totalStudents = students.length;
  const studentsUpToDate = students.filter(student => {
    const studentPayments = payments.filter(payment => payment.deportistaId === student.id);
    const pendingPayments = studentPayments.filter(payment => 
      payment.status === 'pending' || payment.status === 'overdue'
    );
    return pendingPayments.length === 0;
  }).length;
  
  const studentsInDebt = totalStudents - studentsUpToDate;
  const pendingTransfers = payments.filter(payment => payment.status === 'under_review');
  const totalDebt = payments
    .filter(payment => payment.status === 'pending' || payment.status === 'overdue')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={30} color="#3498db" />
          <Text style={styles.summaryNumber}>{totalStudents}</Text>
          <Text style={styles.summaryLabel}>Total Estudiantes</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="checkmark-circle-outline" size={30} color="#27ae60" />
          <Text style={styles.summaryNumber}>{studentsUpToDate}</Text>
          <Text style={styles.summaryLabel}>Al Día</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="warning-outline" size={30} color="#e74c3c" />
          <Text style={styles.summaryNumber}>{studentsInDebt}</Text>
          <Text style={styles.summaryLabel}>En Mora</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="cash-outline" size={30} color="#f39c12" />
          <Text style={styles.summaryNumber}>${totalDebt}</Text>
          <Text style={styles.summaryLabel}>Deuda Total</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transferencias Pendientes</Text>
        {pendingTransfers.length > 0 ? (
          <FlatList
            data={pendingTransfers.slice(0, 5)}
            renderItem={({ item }) => (
              <View style={styles.transferCard}>
                <View style={styles.transferInfo}>
                  <Text style={styles.transferStudent}>
                    {students.find(s => s.id === item.deportistaId)?.name}
                  </Text>
                  <Text style={styles.transferAmount}>${item.amount}</Text>
                </View>
                <Text style={styles.transferDescription}>{item.description}</Text>
                <View style={styles.transferActions}>
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleTransferAction(item.id, 'approve')}
                  >
                    <Text style={styles.approveButtonText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rejectButton}
                    onPress={() => handleTransferAction(item.id, 'reject')}
                  >
                    <Text style={styles.rejectButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay transferencias pendientes</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estudiantes en Mora</Text>
        {studentsInDebt > 0 ? (
          <FlatList
            data={students.filter(student => {
              const studentPayments = payments.filter(payment => payment.deportistaId === student.id);
              const pendingPayments = studentPayments.filter(payment => 
                payment.status === 'pending' || payment.status === 'overdue'
              );
              return pendingPayments.length > 0;
            }).slice(0, 5)}
            renderItem={({ item }) => {
              const studentPayments = payments.filter(payment => payment.deportistaId === item.id);
              const pendingPayments = studentPayments.filter(payment => 
                payment.status === 'pending' || payment.status === 'overdue'
              );
              const totalDebt = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
              
              return (
                <View style={styles.debtCard}>
                  <Text style={styles.debtStudent}>{item.name}</Text>
                  <Text style={styles.debtAmount}>${totalDebt}</Text>
                  <Text style={styles.debtCount}>
                    {pendingPayments.length} pago{pendingPayments.length !== 1 ? 's' : ''} pendiente{pendingPayments.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>¡Todos los estudiantes están al día!</Text>
        )}
      </View>
    </ScrollView>
  );


  const handleTransferAction = (paymentId: string, action: 'approve' | 'reject') => {
    Alert.alert(
      action === 'approve' ? 'Aprobar Transferencia' : 'Rechazar Transferencia',
      `¿Estás seguro de ${action === 'approve' ? 'aprobar' : 'rechazar'} esta transferencia?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Aprobar' : 'Rechazar', 
          onPress: () => {
            Alert.alert(
              'Acción Completada',
              `La transferencia ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel Administrativo</Text>
        <Text style={styles.headerSubtitle}>Escuela de Baloncesto San Pedro</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'dashboard' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('AdminPayments')}
        >
          <Ionicons 
            name="card-outline" 
            size={20} 
            color="#7f8c8d" 
          />
          <Text style={styles.tabText}>
            Pagos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('AdminChampionships')}
        >
          <Ionicons 
            name="trophy-outline" 
            size={20} 
            color="#7f8c8d" 
          />
          <Text style={styles.tabText}>
            Campeonatos
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'dashboard' && renderDashboard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  header: {
    backgroundColor: '#0A0D14', // Header rojo para contraste
    padding: 20,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF', // Blanco para mejor lectura sobre rojo
    opacity: 0.85,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Gris claro
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E62026', // Rojo competitivo
  },
  tabText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    fontWeight: '500',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#E62026', // Rojo competitivo
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF', // Blanco neutro
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0D14', // Negro profundo
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1A1D24', // Gris oscuro para tarjetas
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E62026', // Rojo competitivo
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#E62026',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  transferCard: {
    backgroundColor: '#2A2D34', // Gris más oscuro
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  transferInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  transferStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
  },
  transferAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E62026', // Rojo competitivo
  },
  transferDescription: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginBottom: 10,
  },
  transferActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  approveButton: {
    backgroundColor: '#24C36B', // Verde éxito
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#E62026', // Rojo competitivo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 12,
    fontWeight: 'bold',
  },
  debtCard: {
    backgroundColor: '#2A2D34', // Gris más oscuro
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  debtStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginBottom: 5,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E62026', // Rojo competitivo
    marginBottom: 5,
  },
  debtCount: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
  },
  paymentCard: {
    backgroundColor: '#2A2D34', // Gris más oscuro
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  paymentStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E62026', // Rojo competitivo
  },
  paymentDescription: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
    marginBottom: 5,
  },
  receiptInfo: {
    fontSize: 12,
    color: '#E62026', // Rojo competitivo
    marginBottom: 10,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  championshipCard: {
    backgroundColor: '#2A2D34', // Gris más oscuro
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  championshipName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginBottom: 5,
  },
  championshipCategory: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginBottom: 5,
  },
  championshipMatches: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
    marginBottom: 10,
  },
  championshipActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#E62026', // Rojo competitivo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#24C36B', // Verde éxito
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});
