// Pantalla de Estado de Pagos
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useApp } from '../context/AppContext';
import { Student, Payment } from '../types';

interface PaymentsScreenProps {
  navigation: any;
}

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { students, payments } = useApp();

  // Filtrar estudiantes del padre logueado
  const userStudents = students.filter(student => student.parentId === user?.id);

  const getStudentPaymentStatus = (studentId: string) => {
    const studentPayments = payments.filter(payment => payment.studentId === studentId);
    const pendingPayments = studentPayments.filter(payment => 
      payment.status === 'pending' || payment.status === 'overdue'
    );
    
    if (pendingPayments.length === 0) {
      return { status: 'up_to_date', count: 0 };
    }
    
    return { status: 'pending', count: pendingPayments.length };
  };

  const renderStudentCard = ({ item }: { item: Student }) => {
    const paymentStatus = getStudentPaymentStatus(item.id);
    
    return (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => navigation.navigate('PaymentDetail', { student: item })}
      >
        <View style={styles.studentHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentCategory}>
              {item.category} - {item.gender}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            {paymentStatus.status === 'up_to_date' ? (
              <View style={styles.statusUpToDate}>
                <Ionicons name="happy-outline" size={30} color="#27ae60" />
                <Text style={styles.statusTextUpToDate}>Al día</Text>
              </View>
            ) : (
              <View style={styles.statusPending}>
                <Ionicons name="sad-outline" size={30} color="#e74c3c" />
                <Text style={styles.statusTextPending}>
                  {paymentStatus.count} pendiente{paymentStatus.count !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.studentFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="person-outline" size={16} color="#7f8c8d" />
            <Text style={styles.footerText}>Ver detalles</Text>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
        </View>
      </TouchableOpacity>
    );
  };

  const getOverallStatus = () => {
    const totalStudents = userStudents.length;
    const upToDateStudents = userStudents.filter(student => 
      getStudentPaymentStatus(student.id).status === 'up_to_date'
    ).length;
    
    return { totalStudents, upToDateStudents };
  };

  const overallStatus = getOverallStatus();

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de Pagos</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{overallStatus.totalStudents}</Text>
            <Text style={styles.statLabel}>Estudiante{overallStatus.totalStudents !== 1 ? 's' : ''}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#27ae60' }]}>
              {overallStatus.upToDateStudents}
            </Text>
            <Text style={styles.statLabel}>Al día</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#e74c3c' }]}>
              {overallStatus.totalStudents - overallStatus.upToDateStudents}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      <View style={styles.studentsHeader}>
        <Text style={styles.studentsTitle}>Estado por Estudiante</Text>
        <Text style={styles.studentsSubtitle}>
          Toca una tarjeta para ver el detalle de pagos
        </Text>
      </View>

      <FlatList
        data={userStudents}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {userStudents.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={60} color="#bdc3c7" />
          <Text style={styles.emptyTitle}>Sin estudiantes registrados</Text>
          <Text style={styles.emptyText}>
            Contacta con la administración para registrar a tus hijos.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  summaryCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco
  },
  statLabel: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5', // Gris claro
  },
  studentsHeader: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  studentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
  },
  studentsSubtitle: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginTop: 5,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco
    marginBottom: 5,
  },
  studentCategory: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusUpToDate: {
    alignItems: 'center',
  },
  statusTextUpToDate: {
    fontSize: 12,
    color: '#24C36B', // Verde éxito
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusPending: {
    alignItems: 'center',
  },
  statusTextPending: {
    fontSize: 12,
    color: '#E62026', // Rojo competitivo
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  studentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5', // Gris claro
    paddingTop: 10,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B3B3B3', // Gris medio
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    textAlign: 'center',
    lineHeight: 20,
  },
});
