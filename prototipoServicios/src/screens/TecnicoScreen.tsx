import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import { InformeForm } from './InformeForm';
import { ReportDetailScreen } from './ReportDetailScreen';
import { MyReportsScreen } from './MyReportsScreen';

type Props = {
  onBack: () => void;
  technicianId?: string;
  technicianName?: string;
};

export const TecnicoScreen: React.FC<Props> = ({ 
  onBack, 
  technicianId = '1', 
  technicianName = 'Técnico' 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);
  const [showNewReport, setShowNewReport] = useState(false);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Estados para gestión de informes
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsFilter, setReportsFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Cargar informes del técnico y suscribirse a cambios
  useEffect(() => {
    const loadReports = async () => {
      const reportService = ReportService.getInstance();
      const technicianReports = await reportService.getReportsByTechnician(technicianId);
      setReports(technicianReports);
    };

    loadReports();

    // Suscribirse a cambios en los informes
    const reportService = ReportService.getInstance();
    const unsubscribe = reportService.subscribe((allReports) => {
      const technicianReports = allReports.filter(report => report.technicianId === technicianId);
      setReports(technicianReports);
    });

    return unsubscribe;
  }, [technicianId]);

  // Filtrar informes según el filtro seleccionado
  const filteredReports = reports.filter(report => {
    if (reportsFilter === 'all') return true;
    return report.status === reportsFilter;
  });

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'dashboard':
        // Ya estamos en el dashboard
        break;
      case 'reports':
        setShowMyReports(true);
        break;
      case 'new_report':
        setShowNewReport(true);
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'reports':
        setShowMyReports(true);
        break;
      case 'new_report':
        setShowNewReport(true);
        break;
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
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

  const getReportsCountByStatus = (status: Report['status']) => {
    return reports.filter(report => report.status === status).length;
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Header con botón hamburguesa */}
        <View style={styles.topHeader}>
          <TouchableOpacity 
            style={styles.hamburgerButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu-outline" size={24} color="#495057" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Panel de Técnico</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Bienvenido, {technicianName}</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tus informes de mantenimiento</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Mis Estadísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{reports.length}</Text>
                <Text style={styles.statLabel}>Total Informes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{getReportsCountByStatus('pending')}</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{getReportsCountByStatus('approved')}</Text>
                <Text style={styles.statLabel}>Aprobados</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{getReportsCountByStatus('rejected')}</Text>
                <Text style={styles.statLabel}>Rechazados</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('new_report')}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle-outline" size={22} color="#495057" style={{ marginRight: 12 }} />
                <Text style={styles.actionText}>Nuevo Informe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('reports')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={22} color="#495057" style={{ marginRight: 12 }} />
                <Text style={styles.actionText}>Mis Informes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            {reports.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#ADB5BD" />
                <Text style={styles.emptyStateText}>No tienes informes aún</Text>
                <TouchableOpacity 
                  style={styles.createFirstReportButton}
                  onPress={() => setShowNewReport(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.createFirstReportText}>Crear mi primer informe</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.activityList}>
                {reports.slice(0, 3).map((report) => (
                  <View key={report.id} style={styles.activityItem}>
                    <Ionicons name="document-text-outline" size={20} color="#0D6EFD" style={{ marginRight: 12 }} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{report.title}</Text>
                      <Text style={styles.activityTime}>{formatDate(report.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(report.status)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Modal del menú hamburguesa */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalOverlaySidebar}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú Técnico</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('dashboard')}
                activeOpacity={0.7}
              >
                <Ionicons name="grid-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('new_report')}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Nuevo Informe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('reports')}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Mis Informes</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>Técnico Panel v1.0.0</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Mis Informes */}
      <Modal
        visible={showMyReports}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMyReports(false)}
      >
        <View style={styles.modalOverlayFull}>
          <MyReportsScreen
            technicianId={technicianId}
            technicianName={technicianName}
            onBack={() => setShowMyReports(false)}
          />
        </View>
      </Modal>

      {/* Modal de Nuevo Informe */}
      <Modal
        visible={showNewReport}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewReport(false)}
      >
        <View style={styles.modalOverlayFull}>
          <InformeForm
            onBack={() => setShowNewReport(false)}
            technicianId={technicianId}
            technicianName={technicianName}
          />
        </View>
      </Modal>

      {/* Modal de Detalle de Informe */}
      {showReportDetail && selectedReport && (
        <Modal
          visible={showReportDetail}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportDetail(false)}
        >
          <View style={styles.modalOverlayFull}>
            <ReportDetailScreen
              reportId={selectedReport.id}
              onBack={() => setShowReportDetail(false)}
              canEdit={selectedReport.status === 'pending'}
            />
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
  content: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hamburgerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  backButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
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
  actionsContainer: {
    marginBottom: 30,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  recentActivity: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
    marginTop: 16,
  },
  createFirstReportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 2,
  },
  activityTime: {
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
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlaySidebar: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  closeButton: {
    backgroundColor: '#6C757D',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  menuFooterText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOverlayCentered: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayFull: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  modalCloseButton: {
    backgroundColor: '#6C757D',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  reportsSection: {
    gap: 20,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  reportFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  reportList: {
    gap: 12,
  },
  reportItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  reportActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reportStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  reportStatusText: {
    fontSize: 12,
    color: 'white',
  },
  viewReportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  emptyReportsState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyReportsText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
});
