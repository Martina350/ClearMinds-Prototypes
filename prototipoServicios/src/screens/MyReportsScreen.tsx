import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import { ReportDetailScreen } from './ReportDetailScreen';
import { InformeForm } from './InformeForm';

type Props = {
  technicianId: string;
  technicianName: string;
  onBack: () => void;
};

export const MyReportsScreen: React.FC<Props> = ({ 
  technicianId, 
  technicianName, 
  onBack 
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [showNewReport, setShowNewReport] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();

    // Suscribirse a cambios en los informes
    const reportService = ReportService.getInstance();
    const unsubscribe = reportService.subscribe((allReports) => {
      const myReports = allReports.filter(report => report.technicianId === technicianId);
      setReports(myReports);
    });

    return unsubscribe;
  }, [technicianId]);

  const loadReports = async () => {
    try {
      const reportService = ReportService.getInstance();
      const myReports = await reportService.getReportsByTechnician(technicianId);
      setReports(myReports);
    } catch (error) {
      console.error('Error al cargar informes:', error);
      Alert.alert('Error', 'No se pudieron cargar los informes');
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleEditReport = (report: Report) => {
    if (report.status === 'approved' || report.status === 'rejected') {
      Alert.alert(
        'No se puede editar', 
        'No puedes editar un informe que ya ha sido aprobado o rechazado'
      );
      return;
    }
    setEditingReport(report);
    setShowNewReport(true);
  };

  const handleNewReport = () => {
    setEditingReport(null);
    setShowNewReport(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'in_review': return '#007BFF';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
    }
  };

  const canEditReport = (report: Report) => {
    return report.status === 'pending' || report.status === 'in_review';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={18} color="#000" style={{ marginRight: 4 }} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mis Informes</Text>
          <Text style={styles.subtitle}>{technicianName}</Text>
        </View>
        <TouchableOpacity style={styles.newReportButton} onPress={handleNewReport} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reports.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reports.filter(r => r.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reports.filter(r => r.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Aprobados</Text>
          </View>
        </View>

        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Informes Recientes</Text>
          
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#ADB5BD" />
              <Text style={styles.emptyStateText}>No tienes informes aún</Text>
              <TouchableOpacity 
                style={styles.createFirstReportButton}
                onPress={handleNewReport}
                activeOpacity={0.8}
              >
                <Text style={styles.createFirstReportText}>Crear mi primer informe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => (
                <View key={report.id} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(report.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reportActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleViewReport(report)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="eye-outline" size={16} color="#007BFF" />
                      <Text style={styles.actionButtonText}>Ver</Text>
                    </TouchableOpacity>
                    
                    {canEditReport(report) && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditReport(report)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={16} color="#FFA500" />
                        <Text style={[styles.actionButtonText, { color: '#FFA500' }]}>Editar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalle de Informe */}
      {showReportDetail && selectedReport && (
        <Modal
          visible={showReportDetail}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportDetail(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ReportDetailScreen
                reportId={selectedReport.id}
                onBack={() => setShowReportDetail(false)}
                canEdit={canEditReport(selectedReport)}
                onEdit={() => {
                  setShowReportDetail(false);
                  handleEditReport(selectedReport);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de Nuevo/Editar Informe */}
      {showNewReport && (
        <Modal
          visible={showNewReport}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNewReport(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <InformeForm
                onBack={() => setShowNewReport(false)}
                technicianId={technicianId}
                technicianName={technicianName}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  newReportButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#007BFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    textAlign: 'center',
  },
  reportsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
  createFirstReportButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createFirstReportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  reportsList: {
    gap: 12,
  },
  reportItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007BFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
