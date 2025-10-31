// Pantalla de Pagos para Administradores
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Payment, Deportista } from '../types';

interface AdminPaymentsScreenProps {
  navigation: any;
}

export const AdminPaymentsScreen: React.FC<AdminPaymentsScreenProps> = ({ navigation }) => {
  const { deportistas, payments, updatePaymentStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'transfers' | 'reports'>('transfers');
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);

  // Cálculos para el resumen
  const totalPayments = payments.length;
  const pendingTransfers = payments.filter(payment => payment.status === 'under_review');
  const completedPayments = payments.filter(payment => payment.status === 'paid');
  const pendingPayments = payments.filter(payment => payment.status === 'pending' || payment.status === 'overdue');
  const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Se elimina el apartado de Resumen

  const renderTransfers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transferencias por Revisar</Text>
        {pendingTransfers.length > 0 ? (
          <FlatList
            data={pendingTransfers}
            renderItem={({ item }) => (
              <View style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentStudent}>
                    {deportistas.find(s => s.id === item.deportistaId)?.name}
                  </Text>
                  <Text style={styles.paymentAmount}>${item.amount}</Text>
                </View>
                <Text style={styles.paymentDescription}>{item.description}</Text>
                <Text style={styles.paymentDate}>Subido: {item.createdAt}</Text>
                <TouchableOpacity onPress={() => { setSelectedReceiptPayment(item); setReceiptUri((item.receiptImage as string) || null); setReceiptVisible(true); }}>
                  <Text style={styles.receiptInfo}>Ver Comprobante</Text>
                </TouchableOpacity>
                <View style={styles.paymentActions}>
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
      <Modal
        visible={receiptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReceiptVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setReceiptVisible(false)}>
          <View style={styles.modalContent}>
            {receiptUri ? (
              <Image source={{ uri: receiptUri }} style={styles.receiptImage} resizeMode="contain" />
            ) : (
              <View style={styles.generatedReceipt}>
                <Text style={styles.generatedTitle}>Comprobante de Transferencia</Text>
                <View style={styles.generatedRow}>
                  <Text style={styles.generatedLabel}>Deportista</Text>
                  <Text style={styles.generatedValue}>{deportistas.find(d => d.id === selectedReceiptPayment?.deportistaId)?.name || 'Desconocido'}</Text>
                </View>
                <View style={styles.generatedRow}>
                  <Text style={styles.generatedLabel}>Descripción</Text>
                  <Text style={styles.generatedValue}>{selectedReceiptPayment?.description || 'Pago/Transferencia'}</Text>
                </View>
                <View style={styles.generatedRow}>
                  <Text style={styles.generatedLabel}>Monto</Text>
                  <Text style={styles.generatedValue}>${selectedReceiptPayment?.amount?.toFixed?.(2) || '0.00'}</Text>
                </View>
                <View style={styles.generatedRow}>
                  <Text style={styles.generatedLabel}>Fecha</Text>
                  <Text style={styles.generatedValue}>{selectedReceiptPayment?.createdAt || '-'}</Text>
                </View>
                <View style={styles.generatedRow}>
                  <Text style={styles.generatedLabel}>Referencia</Text>
                  <Text style={styles.generatedValue}>{`SP-${selectedReceiptPayment?.id?.slice?.(0,6) || 'XXXXXX'}`}</Text>
                </View>
                <Text style={[styles.generatedFooter]}>Documento generado automáticamente para revisión</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );

  const renderReports = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reportes de Pagos</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PaymentReport')}
        >
          <Ionicons name="document-text-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Reporte General</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CardPayments')}
        >
          <Ionicons name="card-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Pagos por Tarjeta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('TransferPayments')}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Pagos por Transferencia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen Financiero</Text>
        <View style={styles.financialSummary}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Ingresos Totales</Text>
            <Text style={styles.financialValue}>${totalRevenue}</Text>
          </View>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Pendientes</Text>
            <Text style={styles.financialValue}>${totalPending}</Text>
          </View>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Por Revisar</Text>
            <Text style={styles.financialValue}>{pendingTransfers.length}</Text>
          </View>
        </View>
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
            const next = action === 'approve' ? 'paid' : 'pending';
            updatePaymentStatus(paymentId, next);
            Alert.alert('Acción Completada', `La transferencia ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transfers' && styles.activeTab]}
          onPress={() => setActiveTab('transfers')}
        >
          <Ionicons 
            name="swap-horizontal-outline" 
            size={20} 
            color={activeTab === 'transfers' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'transfers' && styles.activeTabText]}>
            Transferencias
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={20} 
            color={activeTab === 'reports' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reportes
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'transfers' && renderTransfers()}
      {activeTab === 'reports' && renderReports()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0D14',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0D14',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    borderBottomColor: '#E62026',
  },
  tabText: {
    fontSize: 14,
    color: '#B3B3B3',
    fontWeight: '500',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#E62026',
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
    backgroundColor: '#FFFFFF',
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
    color: '#0A0D14',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1A1D24',
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
    color: '#FFFFFF',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E62026',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  paymentCard: {
    backgroundColor: '#2A2D34',
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
    color: '#FFFFFF',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E62026',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  receiptInfo: {
    fontSize: 12,
    color: '#E62026',
    marginBottom: 10,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  approveButton: {
    backgroundColor: '#24C36B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#E62026',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 0,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 12,
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#000000',
  },
  generatedReceipt: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  generatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0D14',
    marginBottom: 12,
    textAlign: 'center',
  },
  generatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  generatedLabel: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  generatedValue: {
    color: '#0A0D14',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  generatedFooter: {
    color: '#7f8c8d',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  debtCard: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  debtStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E62026',
    marginBottom: 5,
  },
  debtCount: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  financialSummary: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
  },
  financialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3D44',
  },
  financialLabel: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

